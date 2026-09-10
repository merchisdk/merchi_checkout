import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishRelease } from './publish-release.mjs';
const input={version:'1.0.1',head:'ours',latest:'1.0.0',latestHead:'old'};
function fixture({changed=false,occupied=false,status=0,owner='ours',missing=false}={}) {
 let calls=0;
 return {get calls(){return calls;},latest:()=>({version:changed?'1.0.2':'1.0.0',gitHead:'old'}),versions:()=>occupied || (calls && !missing) ? ['1.0.0','1.0.1'] : ['1.0.0'],publish:()=>{calls++;return status;},exact:()=>({version:'1.0.1',gitHead:owner})};
}
test('changed latest defers before publish',()=>{const io=fixture({changed:true});assert.equal(publishRelease(input,io).published,false);assert.equal(io.calls,0);});
test('occupied version defers before publish',()=>{const io=fixture({occupied:true});assert.equal(publishRelease(input,io).published,false);assert.equal(io.calls,0);});
test('concurrent manual version collision preserves manual release',()=>{assert.equal(publishRelease(input,fixture({status:1,owner:'manual'})).published,false);});
test('success verifies actual source',()=>assert.equal(publishRelease(input,fixture()).published,true));
test('lost success response reconciles registry',()=>assert.equal(publishRelease(input,fixture({status:1})).published,true));
test('auth or publish failure remains a failure',()=>assert.throws(()=>publishRelease(input,fixture({status:1,missing:true})),/did not create/));
