# Context Lookup AI

Context Lookup AI is a cross‑browser extension that lets you quickly look up information about selected text on any webpage using an AI model. When you highlight text and right‑click or use the hover button, the extension sends the selection along with the surrounding context to OpenAI's API (or a local model) and displays concise information and related facts in an overlay bubble.

## Features
- Works in Chrome and Safari (via Web Extension).
- Adds a context menu item and a small hover button for AI lookup.
- Captures nearby page context (title, URL, surrounding text) to improve the answer.
- Displays answers inline in a clean overlay bubble.
- Stores your OpenAI API key securely in browser storage.
- Supports local LLMs via WebLLM for a zero‑cost mode (optional).

## Installation (Chrome)
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** (toggle in top right).
4. Click **Load unpacked** and select the `context‑lookup‑ai` folder.
5. Open the extension’s **Options** page and enter your OpenAI API key.

## Installation (Safari)
1. Convert the extension to a Safari Web Extension with Xcode:
   ```
   xcrun safari‑web‑extension‑converter /path/to/context‑lookup‑ai --swift --macos --ios
   ```
2. Open the generated Xcode project and build/run the app.
3. Enable the extension in Safari’s settings.
4. On first run, open the extension’s preferences and enter your API key.

## Usage
- Select any text on a webpage.
- Right‑click and choose **Look up with AI**, or click the small magnifying button that appears near your selection.
- An overlay bubble will appear with an AI‑generated explanation and related information.
- If you want to stop using OpenAI’s API, you can choose to run the extension with WebLLM by bundling it locally (see code comments).

## Privacy
The extension sends only the selected text, a snippet of surrounding page text, and basic page metadata (title and URL) to the AI service. Your API key is stored locally using browser sync storage. For maximum privacy, you can run a local LLM and avoid sending any data over the network.

## Contributing
Feel free to fork this project and submit pull requests or open issues. Suggestions for improvements and bug reports are welcome.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
