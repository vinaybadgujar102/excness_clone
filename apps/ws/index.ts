import { Queue } from "bullmq";
import type { Assets, BookTicker } from "./types.ts";
import { FormatterFactory } from "./BookTickerResponseFactory.ts";
import { subscribeToBookTicker } from "./utils.js";
import { BACKPACK_WS_URL } from "./constants.ts";

const myQueue = new Queue("bookTicker");

const wss = new WebSocket(BACKPACK_WS_URL);

wss.onopen = () => {
  console.log("WebSocket connected");
  // subscribe to the book ticker
  subscribeToBookTicker(wss, ["SOL_USDC", "BTC_USDC", "ETH_USDC"]);
};

wss.onmessage = (event) => {
  const { data } = JSON.parse(event.data) as { data: BookTicker };
  const dataFormatter = FormatterFactory.getFormatter(data.s as Assets);
  if (!dataFormatter) {
    console.error("No formatter found for asset", data.s);
    return;
  }
  const formattedData = dataFormatter.formatData(data);
  console.log(formattedData);
};

// if connection error, try to reconnect
wss.onerror = (event) => {
  console.error("WebSocket error", event);
};

wss.onclose = () => {
  console.log("WebSocket closed");
};
