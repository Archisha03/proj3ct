function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${mm}:${ss}`;
}

function parseNumber(value, fallback) {
  const n = Number(value);
  if (Number.isFinite(n) && n >= 0) return n;
  return fallback;
}