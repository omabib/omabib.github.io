// Copy buttons, the feature tabs, keys for the visitor's system, and the
// privacy page's section strip. The pages work without it.
(() => {
  const mac = /Mac|iPhone|iPad/.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');
  if (mac) {
    document.querySelectorAll('.mod').forEach((el) => { el.textContent = '⌘'; });
    const note = document.getElementById('keys-note');
    if (note) note.textContent = 'On Linux, Ctrl takes the place of ⌘.';
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.querySelector('span');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(document.getElementById(button.dataset.copy).textContent.trim());
        label.textContent = 'Copied';
      } catch {
        label.textContent = 'Select and copy';
      }
      setTimeout(() => { label.textContent = 'Copy'; }, 1600);
    });
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (step) { event.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      if (event.key === 'Home') { event.preventDefault(); select(tabs[0], true); }
      if (event.key === 'End') { event.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  const links = [...document.querySelectorAll('.toc a')];
  if (links.length && 'IntersectionObserver' in window) {
    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
      const first = links.find((a) => visible.get(a.hash.slice(1)));
      if (first) links.forEach((a) => a.classList.toggle('active', a === first));
    }, { rootMargin: '0px 0px -60% 0px' });
    links.forEach((a) => { const s = document.getElementById(a.hash.slice(1)); if (s) observer.observe(s); });
  }
})();
