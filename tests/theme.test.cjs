const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(resolve(__dirname, '..', 'js', 'theme.js'), 'utf8');
function start({ saved = null, light = false, readDenied = false, writeDenied = false } = {}) {
  const events = {}, systemEvents = {}, controlEvents = {};
  const root = { dataset: {} }, status = { textContent: '' }, meta = { content: '' };
  const control = { hidden: true, value: '', addEventListener: (name, fn) => { controlEvents[name] = fn; } };
  const system = { matches: light, addEventListener: (name, fn) => { systemEvents[name] = fn; } };
  const storage = new Map(saved === null ? [] : [['mrh.theme', saved]]);
  runInNewContext(source, {
    document: {
      documentElement: root,
      querySelectorAll: () => [control],
      querySelector: () => meta,
      getElementById: () => status,
      addEventListener: (name, fn) => { events[name] = fn; },
    },
    window: { matchMedia: () => system, addEventListener: (name, fn) => { events[name] = fn; } },
    localStorage: {
      getItem: (key) => { if (readDenied) throw new Error('Read denied'); return storage.get(key) ?? null; },
      setItem: (key, value) => { if (writeDenied) throw new Error('Write denied'); storage.set(key, value); },
    },
  });
  return {
    root, control, status, meta, storage,
    ready: () => events.DOMContentLoaded(),
    choose: (value) => { control.value = value; controlEvents.change(); },
    system: (light) => { system.matches = light; systemEvents.change(); },
    external: (value, key = 'mrh.theme') => events.storage({ key, newValue: value }),
  };
}
test('dark is applied before content even when the operating system is light', () => {
  const app = start({ light: true });
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.control.hidden, true);
  app.ready();
  assert.equal(app.control.hidden, false);
  assert.equal(app.control.value, 'dark');
});
test('saved light is applied before content and updates browser chrome', () => {
  const app = start({ saved: 'light' });
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.meta.content, '#f7f7f2');
});
test('explicit choices persist and do not track subsequent system changes', () => {
  const app = start();
  app.ready(); app.choose('light'); app.system(false);
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.storage.get('mrh.theme'), 'light');
});
test('system follows changes while preserving the system preference', () => {
  const app = start({ saved: 'system', light: true });
  app.ready();
  assert.equal(app.control.value, 'system');
  assert.equal(app.root.dataset.theme, 'light');
  app.system(false);
  assert.equal(app.root.dataset.theme, 'dark');
  assert.equal(app.control.value, 'system');
});
test('other tabs update controls and removing a preference restores dark', () => {
  const app = start();
  app.ready(); app.external('light');
  assert.equal(app.root.dataset.theme, 'light');
  assert.equal(app.control.value, 'light');
  app.external('dark', 'unrelated');
  assert.equal(app.root.dataset.theme, 'light');
  app.external(null);
  assert.equal(app.root.dataset.theme, 'dark');
});
test('invalid saved preferences do not change the default', () => {
  assert.equal(start({ saved: 'invalid', light: true }).root.dataset.theme, 'dark');
});
test('unavailable storage is visible without preventing theme changes', () => {
  const app = start({ readDenied: true, writeDenied: true });
  app.ready();
  assert.match(app.status.textContent, /cannot be read/);
  app.choose('light');
  assert.equal(app.root.dataset.theme, 'light');
  assert.match(app.status.textContent, /could not be saved/);
});
