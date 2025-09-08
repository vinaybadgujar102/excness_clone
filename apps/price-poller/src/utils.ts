import { BACKPACK_REQ_PAYLOAD } from "@repo/backend-common/types";

export const getPriceTickerForAssets = (
  ws: WebSocket,
  payload: BACKPACK_REQ_PAYLOAD
) => {
  ws.send(JSON.stringify(payload));
};
