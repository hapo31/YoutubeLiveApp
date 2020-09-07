declare module "bouyomi-chan" {
  type BouyomiChanOption = {
    host: string;
    port: number;
    speed: number;
    tone: number;
    volume: number;
    type: number;
  };

  export default class BouyomiChan {
    constructor(option: BouyomiChanOption);
    speak(message: string): void;
  }
}
