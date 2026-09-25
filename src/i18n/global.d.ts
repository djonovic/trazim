import type { routing } from "./routing";
import type messages from "../../messages/sr-Latn-ME.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
