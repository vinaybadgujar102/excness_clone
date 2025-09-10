import { WebSocket } from "ws";
import { BACKPACK_WS_URL } from "@repo/backend-common/constants";
import { getPriceTickerForAssets } from "./utils";
import {
  CurrentPriceData,
  SubscriptionResonse,
} from "@repo/backend-common/types";
import { createClient } from "redis";

let currentPrice = {};

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
  currentPrice = {
    price: (Number(data.data.a) * 6).toString(),
    decimal: "6",
    asset: data.data.s,
  };
  // client.xAdd("queue1", "*", {
  //   message: JSON.stringify({
  //     kind: "current-price",
  //     ...currentPrice,
  //   }),
  // });
}

ws.on("message", (data) => {
  const response = JSON.parse(data.toString()) as SubscriptionResonse;
  // push this tick, every 500 ms to the engine via stream
  pushToStream(response);
});

setInterval(() => {
  client.xAdd("queue1", "*", {
    message: JSON.stringify({
      kind: "current-price",
      ...currentPrice,
    }),
  });
  currentPrice = {};
}, 500);
