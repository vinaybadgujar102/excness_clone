// {"method":"SUBSCRIBE","params":["bookTicker.WLFI_USDC"],"id":1}

export interface BACKPACK_REQ_PAYLOAD {
  method: "SUBSCRIBE";
  params: string[];
  id: string;
}

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

export interface BookTicker {
  e: string;
  E: number;
  s: string;
  a: string;
  A: string;
  b: string;
  B: string;
  u: string;
  T: number;
}

export interface SubscriptionResonse {
  data: BookTicker;
  stream: string;
}

export interface CurrentPriceData {
  price: string;
  decimal: string;
  asset: string;
}
