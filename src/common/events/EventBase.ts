export type EventType<T> = {
  meta?: string;
  type: string;
  payload: T;
};

// IPC通信用のイベントの作り方講座～～
/**
 * 1. ファイルを作る。命名規則は「{EventName}Event.ts」
 * 2. 名前空間を作る。命名規則は「namespace {ファイル名}」
 * 3. EventType を EventBase.ts から import する
 * 4.
 * // 例
 namespace InitialStateEvent {
    // レンダラーが送信するチャンネル名を定義する
    export const CHANNEL_NAME_RENDERER = "RENDERER.REQUEST_INITIAL_STATE";
    // メインプロセスが送信するチャンネル名を定義する
    export const CHANNEL_NAME_MAIN = "MAIN.RESPONSE_INITIAL_STATE";
    // ipcXXX.send で 第2引数に渡すPayloadの型を定義。EventType<T> を使う
    export type EventPayload = EventType<AppState>;
 }

 // 名前空間をデフォルトエクスポート
 export default InitialStateEvent;

 */
