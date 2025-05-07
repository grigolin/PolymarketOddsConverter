# Polymarket Odds Converter

A browser extension that converts Polymarket implied probabilities to decimal odds. Works on both Chrome and Firefox.

## Features

- Converts Polymarket probabilities to decimal odds
- Toggle extension on/off with a single click
- Works on all Polymarket pages
- Supports both Chrome and Firefox

## Installation

### Chrome

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the extension directory
6. Make sure to use `manifest-chrome.json` as the manifest file by renaming to `manifest.json`

### Firefox

1. Download or clone this repository
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the extension directory
5. Make sure to use `manifest-firefox.json` as the manifest file by renaming to `manifest.json`

## Usage

1. Navigate to any Polymarket page
2. The extension will automatically convert probabilities to decimal odds
3. Click the extension icon in your browser toolbar to toggle the conversion on/off

## Development

The extension uses different manifest files for Chrome and Firefox due to browser-specific requirements:

- `manifest-chrome.json`: Uses service worker for Chrome
- `manifest-firefox.json`: Uses background scripts for Firefox

For reference on this issue, see:
- https://stackoverflow.com/questions/75043889/manifest-v3-background-scripts-service-worker-on-firefox
- https://github.com/w3c/webextensions/issues/282
