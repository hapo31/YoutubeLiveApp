import sendDebugLog from "../debug/sendDebugLog";

export default function attachChatBox(chatItemElement: HTMLElement) {
  sendDebugLog("Chat attached.");
  const observer = new MutationObserver((records, observer) => {
    sendDebugLog(records);
    observer.takeRecords(); // 古いやつは捨てる
  });

  sendDebugLog(chatItemElement);
  observer.observe(chatItemElement, {
    characterData: true,
  });
}
