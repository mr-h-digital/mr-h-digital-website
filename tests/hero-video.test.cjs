const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');

const script = readFileSync(resolve(__dirname, '..', 'js', 'script.js'), 'utf8');
const source = script.slice(script.indexOf('function setupHeroVideo()'));

function start({ theme = 'dark', mobile = false, reduced = false, saveData = false, inView = true } = {}) {
  const events = {}, videoEvents = {}, connectionEvents = {}, warnings = [], pending = [];
  const classes = new Set();
  let themeChanged, intersectionChanged, motionChanged, clicked, loads = 0;
  const root = { dataset: { theme } };
  const motion = { matches: reduced, addEventListener: (_, fn) => { motionChanged = fn; } };
  const connection = { saveData, addEventListener: (_, fn) => { connectionEvents.change = fn; } };
  const toggle = { hidden: true, textContent: '', addEventListener: (_, fn) => { clicked = fn; } };
  const status = { textContent: '' };
  const video = {
    dataset: {
      darkSrc: 'dark.mp4', darkMobileSrc: 'dark-mobile.mp4', lightSrc: 'light.mp4', lightMobileSrc: 'light-mobile.mp4',
    },
    paused: true, error: null,
    getBoundingClientRect: () => ({ top: inView ? 0 : 1200, bottom: inView ? 800 : 2000 }),
    classList: { add: (value) => classes.add(value), remove: (value) => classes.delete(value) },
    addEventListener: (name, fn) => { videoEvents[name] = fn; },
    getAttribute: () => video.src || null,
    hasAttribute: () => Boolean(video.src),
    removeAttribute: () => { delete video.src; },
    pause: () => { video.paused = true; },
    load: () => { loads++; video.error = null; video.playbackRate = 1; },
    play: () => { video.paused = false; return new Promise((resolve, reject) => pending.push({ resolve, reject })); },
  };
  const document = {
    documentElement: root, hidden: false,
    getElementById: (id) => ({ 'hero-video': video, 'hero-video-toggle': toggle, 'hero-video-status': status })[id],
    addEventListener: (name, fn) => { events[name] = fn; },
  };
  runInNewContext(source, {
    document, navigator: { connection }, console: { warn: (...args) => warnings.push(args) },
    window: { innerHeight: 900, IntersectionObserver: true, matchMedia: (query) => query.includes('max-width') ? { matches: mobile } : motion },
    MutationObserver: class { constructor(fn) { themeChanged = fn; } observe() {} },
    IntersectionObserver: class { constructor(fn) { intersectionChanged = fn; } observe() {} },
  });
  return {
    video, toggle, status, classes, warnings, pending,
    get loads() { return loads; },
    click: () => clicked(),
    theme: (value) => { root.dataset.theme = value; themeChanged(); },
    visible: (value) => intersectionChanged([{ isIntersecting: value }]),
    hidden: (value) => { document.hidden = value; events.visibilitychange(); },
    motion: (value) => { motion.matches = value; motionChanged(); },
    data: (value) => { connection.saveData = value; connectionEvents.change(); },
    playing: () => videoEvents.playing(),
    error: () => { video.error = new Error('Network error'); videoEvents.error(); },
  };
}

test('selects exactly the theme and initial viewport source', () => {
  for (const theme of ['dark', 'light']) {
    for (const mobile of [false, true]) {
      const app = start({ theme, mobile });
      assert.equal(app.video.src, `${theme}${mobile ? '-mobile' : ''}.mp4`);
      assert.equal(app.loads, 1);
      assert.equal(app.toggle.hidden, false);
      assert.equal(app.classes.has('is-ready'), false);
      app.playing();
      assert.equal(app.classes.has('is-ready'), true);
    }
  }
});
test('theme changes unload the previous frame and preserve a manual pause', () => {
  const app = start();
  app.playing(); app.click(); app.theme('light');
  assert.equal(app.video.paused, true);
  assert.equal(app.video.src, undefined);
  assert.equal(app.classes.has('is-ready'), false);
  assert.equal(app.toggle.textContent, 'Play background video');
  app.click();
  assert.equal(app.video.src, 'light.mp4');
  assert.equal(app.video.paused, false);
});
test('both themes play at half speed after loads, pauses and source changes', () => {
  const app = start();
  assert.equal(app.video.defaultPlaybackRate, 0.5);
  assert.equal(app.video.playbackRate, 0.5);
  app.click(); app.click();
  assert.equal(app.video.playbackRate, 0.5);
  app.theme('light');
  assert.equal(app.video.playbackRate, 0.5);
  app.error(); app.click();
  assert.equal(app.video.playbackRate, 0.5);
});
test('offscreen and hidden states pause playback and load only when visible', () => {
  const app = start({ inView: false });
  assert.equal(app.loads, 0);
  app.theme('light');
  assert.equal(app.loads, 0);
  app.visible(true);
  assert.equal(app.video.src, 'light.mp4');
  app.hidden(true);
  assert.equal(app.video.paused, true);
  app.hidden(false);
  assert.equal(app.video.paused, false);
  app.click(); app.visible(false); app.visible(true);
  assert.equal(app.video.paused, true);
});
test('reduced motion and data saving never download video without opt-in', () => {
  for (const option of [{ reduced: true }, { saveData: true }]) {
    const app = start(option);
    app.theme('light');
    assert.equal(app.loads, 0);
    assert.match(app.status.textContent, /preference/);
    app.click();
    assert.equal(app.video.src, 'light.mp4');
    assert.equal(app.video.paused, false);
  }
});
test('changes to motion or data preferences immediately stop automatic playback', () => {
  for (const change of ['motion', 'data']) {
    const app = start();
    app[change](true);
    assert.equal(app.video.paused, true);
    app[change](false);
    assert.equal(app.video.paused, false);
  }
});
test('stale play rejections cannot report errors after rapid theme switches', async () => {
  const app = start();
  app.theme('light'); app.theme('dark');
  app.pending[0].reject(new Error('Superseded'));
  app.pending[1].reject(new Error('Superseded'));
  await Promise.resolve();
  assert.equal(app.warnings.length, 0);
  assert.equal(app.status.textContent, '');
  assert.equal(app.video.src, 'dark.mp4');
});
test('network and autoplay failures are visible and retry reloads the selected source', async () => {
  for (const failure of ['network', 'autoplay']) {
    const app = start();
    if (failure === 'network') app.error();
    else app.pending[0].reject(new Error('Autoplay denied'));
    await Promise.resolve();
    assert.equal(app.toggle.textContent, 'Retry background video');
    assert.match(app.status.textContent, /could not/);
    assert.equal(app.video.paused, true);
    assert.equal(app.warnings.length, 1);
    app.click();
    assert.equal(app.video.paused, false);
    assert.equal(app.status.textContent, '');
  }
});
