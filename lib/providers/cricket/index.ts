import { FreeDevCricketProvider } from "./free-dev";
import { SportMonksCricketProvider } from "./sportmonks";
import { CricbuzzProvider } from "./cricbuzz";
import type { CricketDataProvider } from "./types";

export function getCricketProvider(): CricketDataProvider {
  const provider = (process.env.CRICKET_PROVIDER || "").toLowerCase();

  // Auto-upgrade to Cricbuzz when API key is present
  if (!provider && process.env.CRICBUZZ_API_KEY) {
    return new CricbuzzProvider();
  }

  if (provider === "cricbuzz") {
    return new CricbuzzProvider();
  }

  // Auto-upgrade to SportMonks when token is present
  if (!provider && process.env.SPORTMONKS_API_TOKEN) {
    return new SportMonksCricketProvider();
  }

  if (provider === "sportmonks") {
    return new SportMonksCricketProvider();
  }

  return new FreeDevCricketProvider();
}
