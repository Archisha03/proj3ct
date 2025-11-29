<script src="notes.js"></script>

document.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('notes-text');
  const saveBtn = document.getElementById('notes-save');
  const statusEl = document.getElementById('notes-status');
  if (!textarea || !saveBtn || !statusEl) return;

  // Load saved notes
  try {
    const result = await chrome.storage.sync.get(['sb_notes']);
    textarea.value = result.sb_notes || '';
  } catch (e) {
    console.error(e);
  }

  function showStatus(text) {
    statusEl.textContent = text;
  }

  saveBtn.addEventListener('click', async () => {
    const value = textarea.value;
    showStatus('Saving...');
    try {
      await chrome.storage.sync.set({ sb_notes: value });
      showStatus('Saved');
    } catch (e) {
      console.error(e);
      showStatus('Error saving');
    }
  });

  // Optional: auto “unsaved changes” indicator
  textarea.addEventListener('input', () => {
    showStatus('Unsaved changes…');
  });
});