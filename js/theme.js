(function () {
  const key = 'mrh.theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: light)');
  const valid = (value) => ['dark', 'light', 'system'].includes(value);
  let preference = 'dark';
  let storageError = '';
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch {
    storageError = 'Theme preferences cannot be read on this device.';
  }
  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'light' : 'dark') : preference;
    root.dataset.theme = theme;
    document.querySelectorAll('[data-theme-select]').forEach((select) => { select.value = preference; });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f7f7f2' : '#15181c';
  }
  apply();
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : 'dark';
    apply();
  });
  document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('theme-status');
    const report = (message) => { if (status) status.textContent = message; };
    report(storageError);
    document.querySelectorAll('[data-theme-select]').forEach((select) => {
      select.hidden = false;
      select.value = preference;
      select.addEventListener('change', () => {
        preference = select.value;
        apply();
        try {
          localStorage.setItem(key, preference);
          report('');
        } catch {
          report('Theme changed for this page, but could not be saved. It may reset when you navigate or return.');
        }
      });
    });
  });
})();
