import { readFile } from "fs/promises";

type AppConfigRaw = {
  channeId: string;
  firstView: "recent" | "recent_stream" | "create_stream";
};
type AppConfig = {
  channeId: string;
  firstViewURL: string;
};

const youtubeChannelBaseURL = "https://studio.youtube.com/channel/";

export default async function configParser(configFilePath: string): Promise<AppConfig> {
  const configRaw: AppConfigRaw = JSON.parse(await readFile(configFilePath).toString());

  const firstViewURL = (() => {
    switch (configRaw.firstView) {
      case "create_stream":
        return `${youtubeChannelBaseURL}${configRaw.channeId}}/livestreaming/stream`;

      default:
        throw new Error(configRaw.firstView);
    }
  })();

  return {
    ...configRaw,
    firstViewURL,
  };
}
