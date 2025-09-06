import type { Assets, Subscription } from "./types.ts";

export function subscribeToBookTicker(wss: WebSocket, assets: Assets[]) {
  const subscription: Subscription = {
    method: "SUBSCRIBE",
    params: assets.map((asset) => `bookTicker.${asset}`),
    id: 1,
  };
  wss.send(JSON.stringify(subscription));
}
