import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishRelease } from './publish-release.mjs';
const input={version:'1.0.1',head:'ours',latest:'1.0.0',latestHead:'old'};
function fixture({changed=false,occupied=false,status=0,owner='ours',delay=0}={}) {
 let calls=0,reads=0,waits=0;
 return {get calls(){return calls;},get reads(){return reads;},get waits(){return waits;},
 latest:()=>({version:changed?'1.0.2':'1.0.0',gitHead:'old'}),
 versions:()=>occupied?['1.0.0','1.0.1']:['1.0.0'],
 publish:()=>{calls++;return status;},wait:async()=>{waits++;},
 exact:()=>{if(reads++<delay)throw Error('Registry not ready');return {version:'1.0.1',gitHead:owner};}};
}
test('changed latest defers before publish',async()=>{const io=fixture({changed:true});assert.equal((await publishRelease(input,io)).published,false);assert.equal(io.calls,0);});
test('occupied version defers before publish',async()=>{const io=fixture({occupied:true});assert.equal((await publishRelease(input,io)).published,false);assert.equal(io.calls,0);});
test('concurrent manual version collision preserves manual release',async()=>{assert.equal((await publishRelease(input,fixture({status:1,owner:'manual'}))).published,false);});
test('success verifies exact version despite stale versions list',async()=>assert.equal((await publishRelease(input,fixture())).published,true));
test('lost success response reconciles registry',async()=>assert.equal((await publishRelease(input,fixture({status:1}))).published,true));
test('delayed visibility retries reads without republishing',async()=>{const io=fixture({delay:3});assert.equal((await publishRelease(input,io)).published,true);assert.equal(io.calls,1);assert.equal(io.waits,3);});
test('persistent registry failure is bounded and never republishes',async()=>{const io=fixture({status:1,delay:99});await assert.rejects(publishRelease(input,io),/Could not verify/);assert.equal(io.calls,1);assert.equal(io.reads,7);});
