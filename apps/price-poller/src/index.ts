import { WebSocket } from "ws";
import { BACKPACK_WS_URL } from "@repo/backend-common/constants";
import { getPriceTickerForAssets } from "./utils";
import { SubscriptionResonse } from "@repo/backend-common/types";

const ws = new WebSocket(BACKPACK_WS_URL);

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

ws.on("message", (data) => {
  const response = JSON.parse(data.toString()) as SubscriptionResonse;
  // push this tick, every 500 ms to the engine via stream
});
