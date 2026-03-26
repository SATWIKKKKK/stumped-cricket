import { FreeDevCricketProvider } from "./free-dev";
import { SportMonksCricketProvider } from "./sportmonks";
import type { CricketDataProvider } from "./types";

export function getCricketProvider(): CricketDataProvider {
  const provider = (process.env.CRICKET_PROVIDER || "").toLowerCase();

  // Auto-upgrade to SportMonks when token is present, unless provider is explicitly set to free-dev.
  if (!provider && process.env.SPORTMONKS_API_TOKEN) {
    return new SportMonksCricketProvider();
  }

  if (provider === "sportmonks") {
    return new SportMonksCricketProvider();
  }

  return new FreeDevCricketProvider();
}
