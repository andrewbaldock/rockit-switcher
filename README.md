# <img src="icons/icon48.png" height="32" valign="middle" alt=""> Rockit Tab Switcher

Browser extension (Chrome + Firefox) that switches between dev and prod for andrewbaldock.com and Aether.

## URL Mappings

| From | To |
|------|-----|
| `localhost:5173/aether[/*]` | `aether.andrewbaldock.com[/*]` |
| `localhost:5174[/*]` | `aether.andrewbaldock.com[/*]` |
| `localhost:5173[/*]` | `andrewbaldock.com[/*]` |
| `aether.andrewbaldock.com[/*]` | `localhost:5174[/*]` |
| `andrewbaldock.com[/*]` | `localhost:5173[/*]` |

Path and query string are preserved in all cases. The `/aether` prefix rule takes priority over the general `5173` rule.

## Repo structure

```
rockit/
├── icons/              # Source icons (all sizes, generated from rockit_2.png)
├── shared/
│   └── switcher.js     # URL mapping logic (shared, no dependencies)
├── chrome/
│   ├── manifest.json
│   ├── icons/          # Symlinks → ../icons/
│   └── popup/
│       ├── popup.html
│       ├── popup.css
│       └── popup.js
└── firefox/
    ├── manifest.json
    ├── icons/          # Symlinks → ../icons/
    └── popup/
        ├── popup.html
        ├── popup.css
        └── popup.js
```

`shared/switcher.js` is loaded via a `<script>` tag in each popup — no build step needed.

## Install

### Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `chrome/` directory

### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `firefox/manifest.json`

For a permanent install, sign the extension via [addons.mozilla.org](https://addons.mozilla.org/developers/) or use `web-ext` to build a signed `.xpi`.

## Development

No build step. Edit `shared/switcher.js` to change URL mappings, reload the extension.

To add a new mapping (e.g. a third local port), edit the `getSwitchedUrl` function in `shared/switcher.js`.

### Testing the switcher logic

```js
node -e "
const { getSwitchedUrl } = require('./shared/switcher.js');
const cases = [
  'http://localhost:5173/',
  'http://localhost:5173/about',
  'http://localhost:5173/aether',
  'http://localhost:5173/aether/chat',
  'http://localhost:5174/',
  'http://localhost:5174/some/path',
  'https://andrewbaldock.com/',
  'https://andrewbaldock.com/about',
  'https://aether.andrewbaldock.com/',
  'https://aether.andrewbaldock.com/chat',
];
cases.forEach(u => console.log(u, '->', getSwitchedUrl(u)));
"
```
