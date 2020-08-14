export default function attachChatBox(onReceiveChat: (element: HTMLElement) => void) {
  const chatItemElement = document.getElementById("chat");
  if (!chatItemElement) {
    throw "chatItemElement is null";
  }
  const observer = new MutationObserver((records, observer) => {
    if (records.length <= 0) {
      return;
    }

    for (const record of records) {
      for (const item of Array.from(record.addedNodes)) {
        if (item.childNodes.length <= 0) {
          continue;
        }
        const element = item.childNodes[0].parentElement;
        if (element?.localName === "yt-live-chat-text-message-renderer" || element?.localName === "yt-live-chat-paid-message-renderer") {
          onReceiveChat(element);
        }
      }
    }

    observer.takeRecords();
  });

  observer.observe(chatItemElement, { childList: true, subtree: true });

  console.log("chat attached");

  return () => {
    observer.disconnect();
  };
}
