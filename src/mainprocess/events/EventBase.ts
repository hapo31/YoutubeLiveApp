function bindIpcChannelListener() {}

type EventType<T> = {
  channel: string;
  payload: T;
};
