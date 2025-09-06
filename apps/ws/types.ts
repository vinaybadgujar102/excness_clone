export interface FormattedBookTicker {
  asset: string;
  price: number;
  decimal: number;
}

export interface BookTicker {
  A: string; // Ask size
  B: string;
  E: number;
  T: number;
  a: string;
  b: string;
  e: string;
  s: string;
  u: number;
}

// example
// {
//     "e": "bookTicker",          // Event type
//     "E": 1694687965941000,      // Event time in microseconds
//     "s": "SOL_USDC",            // Symbol
//     "a": "18.70",               // Inside ask price
//     "A": "1.000",               // Inside ask quantity
//     "b": "18.67",               // Inside bid price
//     "B": "2.000",               // Inside bid quantity
//     "u": "111063070525358080",  // Update ID of event
//     "T": 1694687965940999       // Engine timestamp in microseconds
//   }

export interface Subscription {
  method: SubscriptionMethod;
  params: string[];
  id: number;
}

export type Assets = "SOL_USDC" | "BTC_USDC" | "ETH_USDC";

export type SubscriptionMethod = "SUBSCRIBE" | "UNSUBSCRIBE";
