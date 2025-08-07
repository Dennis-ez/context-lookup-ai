// Minimal overlay to show results
let bubble;
function showBubble(text, at = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect()) {
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.style.cssText = `
      position: fixed; z-index: 2147483647; max-width: 480px; 
      background: white; color: #111; border: 1px solid #ccc; border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,.15); padding: 12px; font: 13px/1.4 system-ui;
    `;
    document.body.appendChild(bubble);
  }
  bubble.textContent = typeof text === "string" ? text : "";
  const top = (at?.bottom || 100) + 8 + window.scrollY;
  const left = Math.min((at?.left || 100) + window.scrollX, window.innerWidth - bubble.offsetWidth - 12);
  bubble.style.top = `${top}px`;
  bubble.style.left = `${left}px`;
}

// Optional: tiny hover button after text selection
let btn;
document.addEventListener("mouseup", () => {
  const sel = window.getSelection().toString().trim();
  if (!sel) { if (btn) btn.remove(); return; }
  const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
  if (!btn) {
    btn = document.createElement("button");
    btn.textContent = "🔎";
    btn.title = "Look up with AI";
    btn.style.cssText = `
      position: fixed; z-index: 2147483647; padding: 2px 6px; font-size: 12px;
      border-radius: 6px; border: 1px solid #bbb; background: #f5f5f5; cursor: pointer;
    `;
    btn.onclick = () => chrome.runtime.sendMessage({ type: "LOOKUP_FROM_BUTTON" });
    document.body.appendChild(btn);
  }
  btn.style.top = `${rect.bottom + 6 + window.scrollY}px`;
  btn.style.left = `${rect.right + 6 + window.scrollX}px`;
});

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.type === "AI_RESULT") {
    if (msg.error) showBubble(msg.error);
    else showBubble(msg.answer);
  }
});
