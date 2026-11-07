(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const dialog = document.querySelector('#citation-dialog');
  const field = document.querySelector('#citation-text');
  const status = document.querySelector('#copy-status');
  const dataElement = document.querySelector('#citation-data');
  const data = dataElement ? JSON.parse(dataElement.textContent) : {};
  let trigger;
  document.querySelectorAll('[data-cite]').forEach(button => button.addEventListener('click', () => {
    const item = data[button.dataset.cite];
    if (!item || !dialog) return;
    trigger = button;
    document.querySelector('#citation-paper').textContent = item.title;
    field.value = item.bib;
    status.textContent = '';
    dialog.showModal();
    document.querySelector('#close-citation').focus();
  }));
  document.querySelector('#close-citation')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => trigger?.focus());
  dialog?.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  document.querySelector('#copy-citation')?.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(field.value);
      status.textContent = 'BibTeX copied.';
    } catch {
      field.focus(); field.select();
      status.textContent = 'Citation selected. Press Ctrl+C (or ⌘C) to copy.';
    }
  });
  const visitHeading = document.querySelector('[data-visit-until]');
  if (visitHeading && new Date().toISOString().slice(0,10) > visitHeading.dataset.visitUntil) visitHeading.textContent = 'Research visit';
})();
