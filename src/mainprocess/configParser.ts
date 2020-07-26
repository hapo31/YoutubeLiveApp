import { readFileSync } from "fs";

type AppConfigRaw = {
  channelId: string;
  firstView: "recent_stream" | "create_stream";
};
export type AppConfig = {
  channelId: string;
  firstViewURL: string;
};

const youtubeChannelBaseURL = "https://studio.youtube.com/channel";

export default function configParser(configFilePath: string): AppConfig {
  const configRaw = JSON.parse(readFileSync(configFilePath).toString()) as AppConfigRaw;

  console.log(configRaw);

  const firstViewURL = (() => {
    switch (configRaw.firstView) {
      case "create_stream":
        return `${youtubeChannelBaseURL}/${configRaw.channelId}/livestreaming/stream`;

      case "recent_stream":
        return "";

      default:
        throw new Error(configRaw.firstView);
    }
  })();

  return {
    ...configRaw,
    firstViewURL,
  };
}
