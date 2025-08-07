// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookup-ai",
    title: "Look up with AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "lookup-ai" || !tab?.id) return;

  // Ask the content script for rich context around the selection
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const sel = window.getSelection();
      const selectionText = sel ? sel.toString().trim() : "";
      function nearestBlock(node) {
        while (node && node.nodeType === 3) node = node.parentElement;
        while (node && !/^(P|LI|DIV|SECTION|ARTICLE|TD|BODY)$/i.test(node.tagName)) {
          node = node.parentElement;
        }
        return node || document.body;
      }
      const block = sel && sel.rangeCount ? nearestBlock(sel.getRangeAt(0).commonAncestorContainer) : document.body;
      const blockText = (block?.innerText || "").replace(/\s+/g, " ").trim();
      const contextSnippet = blockText.slice(0, 1200);

      return {
        selectionText,
        contextSnippet,
        pageTitle: document.title,
        pageUrl: location.href
      };
    }
  });

  // Get API key (entered by the user in Options)
  const { openaiKey } = await chrome.storage.sync.get("openaiKey");
  if (!openaiKey) {
    await chrome.runtime.openOptionsPage();
    return;
  }

  // Compose prompt
  const system = "You are a concise research assistant. Use only the page context provided. If unsure, say so.";
  const user = `Selected text: "${result.selectionText}"

Page title: ${result.pageTitle}
URL: ${result.pageUrl}

Nearby context:\n${result.contextSnippet}

Task: Explain what the selection likely refers to on this page and add 2–3 relevant facts.`;

  // Call OpenAI Responses API
  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      max_output_tokens: 350
    })
  });

  if (!resp.ok) {
    const msg = `API error: ${resp.status} ${await resp.text()}`;
    await chrome.tabs.sendMessage(tab.id, { type: "AI_RESULT", error: msg });
    return;
  }

  const data = await resp.json();
  const answer = data.output_text || data.choices?.[0]?.message?.content || "(no output)";

  await chrome.tabs.sendMessage(tab.id, { type: "AI_RESULT", answer });
});

// Listen for hover button message (optional)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "LOOKUP_FROM_BUTTON" && sender.tab?.id) {
    chrome.contextMenus.onClicked({ menuItemId: "lookup-ai" }, sender.tab);
  }
});
