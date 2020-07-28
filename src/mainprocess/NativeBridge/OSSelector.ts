export default function osSelector({ win32, darwin, other }: { win32?: () => void; darwin?: () => void; other?: (platform: string) => void }) {
  switch (process.platform) {
    case "win32":
      if (win32) {
        win32();
      }
      break;
    case "darwin":
      if (darwin) {
        darwin();
      }
      break;
    default:
      if (other) {
        other(process.platform);
      }
  }
}
