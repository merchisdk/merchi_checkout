import { test } from 'node:test';
import assert from 'node:assert/strict';
import { plan } from './release-plan.mjs';
test('preserves prepared unpublished release', () => assert.deepEqual(plan('1.3.2','1.2.1','new','old'),{version:'1.3.2',published:false}));
test('bumps patch after a new merge', () => assert.equal(plan('1.3.2','1.3.2','new','old').version,'1.3.3'));
test('registry newer than checkout still advances safely', () => assert.equal(plan('1.2.0','1.4.9','new','old').version,'1.4.10'));
test('same published commit is idempotent', () => assert.deepEqual(plan('1.3.2','1.3.2','same','same'),{version:'1.3.2',published:true}));
test('rejects prerelease version rather than publishing it as latest', () => assert.throws(() => plan('1.3.2-beta.1','1.3.1','x','y')));
