import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tagDecision } from './release-tag.mjs';
const head='a'.repeat(40), input={version:'1.3.2',head,ancestor:true};
test('recovers missing tag for published ancestor even after later merges',()=>assert.equal(tagDecision(input),'create'));
test('existing matching tag is idempotent',()=>assert.equal(tagDecision({...input,existing:head}),'present'));
test('foreign tag is preserved and failure reported',()=>assert.throws(()=>tagDecision({...input,existing:'b'.repeat(40)}),/refusing/));
test('unknown or non-ancestor manual source is skipped',()=>{assert.equal(tagDecision({...input,head:undefined}),'skip');assert.equal(tagDecision({...input,ancestor:false}),'skip');});
