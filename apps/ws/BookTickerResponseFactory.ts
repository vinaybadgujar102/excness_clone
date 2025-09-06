import type { Assets, BookTickerResponseFormatter } from "./types.ts";
import { SolFormatter } from "./BookTickerResponseFormatter.ts";
import { BtcFormatter } from "./BookTickerResponseFormatter.ts";
import { EthFormatter } from "./BookTickerResponseFormatter.ts";

export class FormatterFactory {
  static getFormatter(asset: Assets): BookTickerResponseFormatter {
    switch (asset) {
      case "SOL_USDC":
        return new SolFormatter();
      case "BTC_USDC":
        return new BtcFormatter();
      case "ETH_USDC":
        return new EthFormatter();
    }
  }
}
