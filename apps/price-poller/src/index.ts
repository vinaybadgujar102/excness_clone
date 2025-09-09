import { WebSocket } from "ws";
import { BACKPACK_WS_URL } from "@repo/backend-common/constants";
import { getPriceTickerForAssets } from "./utils";
import { SubscriptionResonse } from "@repo/backend-common/types";
import { createClient } from "redis";

const ws = new WebSocket(BACKPACK_WS_URL);
const client = createClient();

client.connect();

ws.on("error", console.error);

// {"method":"SUBSCRIBE","params":["bookTicker.WLFI_USDC"],"id":1}

ws.on("open", () => {
  console.log("Connected to backpack server");
  //   getPriceTickerForAssets(ws, {
  //     method: "SUBSCRIBE",
  //     assets: ["bookTicker.WLFI_USDC"],
  //     id: "1",
  //   });
  const payload = {
    method: "SUBSCRIBE",
    params: ["bookTicker.SOL_USDC"],
    id: 1,
  };

  ws.send(JSON.stringify(payload));
});

function pushToStream(data: SubscriptionResonse) {
  const flatData = {
    stream: data.stream,
    event: data.data.e,
    eventTime: data.data.E.toString(),
    symbol: data.data.s,
    askPrice: data.data.a,
    askQuantity: data.data.A,
    bidPrice: data.data.b,
    bidQuantity: data.data.B,
    updateId: data.data.uz,
    timestamp: data.data.T.toString(),
  };
  client.xAdd("queue1", "*", flatData);
}

ws.on("message", (data) => {
  const response = JSON.parse(data.toString()) as SubscriptionResonse;
  // push this tick, every 500 ms to the engine via stream
});
