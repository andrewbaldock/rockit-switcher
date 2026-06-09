// Inline the switcher logic — service workers can't load relative scripts
// via importScripts with symlinked paths reliably across all Chrome versions.

const PROD_MAIN   = 'andrewbaldock.com';
const PROD_AETHER = 'aether.andrewbaldock.com';
const DEV_MAIN    = 'localhost:5173';
const DEV_AETHER  = 'localhost:5174';

function getSwitchedUrl(urlStr) {
  let url;
  try { url = new URL(urlStr); } catch { return null; }

  const host = url.host;
  const pathname = url.pathname;
  const rest = pathname + url.search + url.hash;

  if (host === DEV_MAIN)    return `https://${PROD_MAIN}${rest}`;
  if (host === DEV_AETHER)  return `https://${PROD_AETHER}${rest}`;
  if (host === PROD_AETHER) return `http://${DEV_AETHER}${rest}`;
  if (host === PROD_MAIN)   return `http://${DEV_MAIN}${rest}`;
  return null;
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab?.url) return;
  const target = getSwitchedUrl(tab.url);
  if (target) chrome.tabs.create({ url: target, index: tab.index + 1 });
});
