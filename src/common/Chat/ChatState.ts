export type ChatState = {
  willInit: boolean;
  attached: boolean;
  videoId: string;
  errors: string[];
};

export const initialState: ChatState = {
  willInit: false,
  attached: false,
  videoId: "",
  errors: [],
};
