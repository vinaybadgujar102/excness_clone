const ws = new WebSocket("wss://ws.backpack.exchange/");

interface formattedData {
  asset: string;
  price: number;
  decimal: number;
}

interface bookTicker {
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

const inMemoryData: Map<string, formattedData[]> = new Map();

function formatData(event: bookTicker): formattedData {
  return {
    asset: event.s,
    price:
      event.s === "SOL_USDC"
        ? parseFloat(event.b) * 10 ** 6
        : event.s === "BTC_USDC"
          ? parseFloat(event.b) * 10 ** 4
          : parseFloat(event.a) * 10 ** 4,
    decimal: event.s === "SOL_USDC" ? 6 : event.s === "BTC_USDC" ? 4 : 4,
  };
}

ws.onopen = function (event) {
  console.log("WebSocket Client Connected");

  // Send subscription message after connection is established

  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: [
        "bookTicker.SOL_USDC",
        "bookTicker.BTC_USDC",
        "bookTicker.ETH_USDC",
      ],
      id: 1,
    })
  );
};

ws.onmessage = function (event) {
  const { data } = JSON.parse(event.data) as { data: bookTicker };
  const formattedData = formatData(data);
  if (inMemoryData.has(formattedData.asset)) {
    const existingData = inMemoryData.get(formattedData.asset);
    existingData?.push(formattedData);
    inMemoryData.set(formattedData.asset, existingData ?? []);
  } else {
    inMemoryData.set(formattedData.asset, [formattedData]);
  }
  console.log(inMemoryData);
};

ws.onerror = function (error) {
  console.log("WebSocket Error: " + error);
};

ws.onclose = function (event) {
  console.log("WebSocket Connection Closed");
};
