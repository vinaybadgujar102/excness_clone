import type { BookTicker, FormattedBookTicker } from "./types.ts";

export interface BookTickerResponseFormatter {
  formatData(event: BookTicker): FormattedBookTicker;
}

class SolFormatter implements BookTickerResponseFormatter {
  formatData(event: BookTicker): FormattedBookTicker {
    return {
      asset: event.s,
      price: parseFloat(event.b) * 10 ** 6,
      decimal: 6,
    };
  }
}

class EthFormatter implements BookTickerResponseFormatter {
  formatData(event: BookTicker): FormattedBookTicker {
    return {
      asset: event.s,
      price: parseFloat(event.b) * 10 ** 4,
      decimal: 4,
    };
  }
}

class BtcFormatter implements BookTickerResponseFormatter {
  formatData(event: BookTicker): FormattedBookTicker {
    return {
      asset: event.s,
      price: parseFloat(event.b) * 10 ** 4,
      decimal: 4,
    };
  }
}

export { SolFormatter, EthFormatter, BtcFormatter };
