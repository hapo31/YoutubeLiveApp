import sendDebugLog from "../debug/sendDebugLog";

export default function attachChatBox(chatItemElement: HTMLElement) {
  sendDebugLog("Chat attached.");
  const observer = new MutationObserver((records, observer) => {
    console.log({ records });
    sendDebugLog(records);
    // observer.takeRecords(); // 古いやつは捨てる
  });
  observer.observe(chatItemElement, { childList: true, subtree: true, attributes: true });
}
