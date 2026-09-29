const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { Readable } = require('node:stream');
const { rewriteArchive, restoreArchive } = require('../src/desktop_archive');

test('archive patch preserves other files and unpacked binaries; snapshot restores byte for byte', async () => {
  const asar = await import('@electron/asar');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'antigravity-tr-test-'));
  const archive = path.join(root, 'Türkçe klasör', 'app.asar');
  const source = new Map([
    ['package.json', JSON.stringify({ version: '2.17.0' })],
    ['dist/preload.js', 'original'], ['dist/nested/unchanged.js', 'unchanged'],
    ['native/library.node', 'unpacked-binary']
  ]);
  try {
    await asar.createPackageFromStreams(archive, [...source].map(([name, value]) => ({
      type: 'file', path: name, unpacked: name.endsWith('.node'),
      stat: { size: Buffer.byteLength(value), mode: 0o644 }, streamGenerator: () => Readable.from([Buffer.from(value)])
    })));
    const originalBytes = fs.readFileSync(archive);
    const result = await rewriteArchive(archive, new Map([['dist/preload.js', Buffer.from('fixed')]]));
    assert.equal(asar.extractFile(archive, path.normalize('dist/preload.js')).toString(), 'fixed');
    for (const [name, value] of source) {
      if (name !== 'dist/preload.js') assert.equal(asar.extractFile(archive, path.normalize(name)).toString(), value);
    }
    assert.equal(asar.statFile(archive, path.normalize('native/library.node')).unpacked, true);
    assert.deepEqual(fs.readFileSync(result.backup), originalBytes);
    await restoreArchive(archive, result.backup);
    assert.deepEqual(fs.readFileSync(archive), originalBytes);
    await assert.rejects(rewriteArchive(archive, new Map([['missing.js', Buffer.from('x')]])));
    await assert.rejects(rewriteArchive(archive, new Map([['native/library.node', Buffer.from('x')]])));
    assert.deepEqual(fs.readFileSync(archive), originalBytes);
    await rewriteArchive(archive, new Map([['package.json', Buffer.from('{"version":"9.0.0"}')]]));
    await assert.rejects(restoreArchive(archive, result.backup), /sürümleri farklı/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
