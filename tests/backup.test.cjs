const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function subject({ denied = false, fail = false, missingPhoto = false } = {}) {
  const calls = [];
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('app/api/backup/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, Response, require: id => {
    if (id.endsWith('googleAuth')) return { getGoogleSession: async () => { if (denied) throw new Error('denied'); return { user: { id: 'owner-a', email: 'a@example.com' } }; } };
    if (id.endsWith('supabaseStorage')) return { signedPhotoUrl: async () => missingPhoto ? null : 'https://storage.invalid/signed' };
    return {
      queryRows: async path => {
        calls.push(path);
        if (fail) return { ok: false, data: [] };
        if (path.startsWith('patients?') && path.includes('offset=0')) return { ok: true, data: Array.from({ length: 500 }, (_, i) => ({ id: i })) };
        if (path.startsWith('patients?')) return { ok: true, data: [{ id: 501 }] };
        if (path.startsWith('photos?')) return { ok: true, data: [{ id: 'photo-1', file_url: 'owner-a/patient/photo', file_name: '../foto.jpg' }] };
        return { ok: true, data: [] };
      },
      writeAudit: async () => {},
      jsonError: error => Response.json({ error: error.message }, { status: 500 }),
    };
  } });
  return { get: module.exports.GET, calls };
}

test('backup scopes every page to the authenticated owner and includes photo files', async () => {
  const { get, calls } = subject();
  const response = await get();
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.data.patients.length, 501);
  assert.ok(calls.every(path => path.includes('owner_id=eq.owner-a')));
  assert.ok(calls.some(path => path.includes('offset=500')));
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].path.split('/').length, 2);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});

test('failed data reads and unavailable photos fail the complete backup', async () => {
  for (const options of [{ fail: true }, { missingPhoto: true }]) assert.equal((await subject(options).get()).status, 500);
});

test('unauthenticated requests never query clinical records', async () => {
  const { get, calls } = subject({ denied: true });
  assert.equal((await get()).status, 500);
  assert.equal(calls.length, 0);
});
