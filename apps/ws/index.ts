import { Queue } from "bullmq";
import type { Assets, BookTicker, FormattedBookTicker } from "./types.ts";
import { FormatterFactory } from "./BookTickerResponseFactory.ts";
import { subscribeToBookTicker } from "./utils.ts";
import { BACKPACK_WS_URL } from "./constants.ts";
import { Redis } from "ioredis";

const myQueue = new Queue("bookTicker");

const redisClient = new Redis({ maxRetriesPerRequest: null });
const priceUpdates = new Map<string, FormattedBookTicker>();

const wss = new WebSocket(BACKPACK_WS_URL);

const buffer: BookTicker[] = [];

async function flushTickerDataToQueue() {
  setInterval(async () => {
    if (buffer.length > 0) {
      const jobs = buffer.map((data) => ({
        name: "bookTicker",
        data,
      }));
      await myQueue.addBulk(jobs);
      buffer.length = 0;
    }
  }, 500); // 500ms
}

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
  publishDataToRedisPubSub(formattedData);
  buffer.push(formattedData);
};

// if connection error, try to reconnect
wss.onerror = (event) => {
  console.error("WebSocket error", event);
};

wss.onclose = () => {
  console.log("WebSocket closed");
};

//flushTickerDataToQueue();

// publish data to redis pubsub
function publishDataToRedisPubSub(data: FormattedBookTicker) {
  priceUpdates.set(data.asset, data);
}

setInterval(() => {
  if (priceUpdates.size > 0) {
    const priceUpdatesArray = Array.from(priceUpdates.values());
    redisClient.publish(
      "price_updates",
      JSON.stringify({ price_updates: priceUpdatesArray })
    );
    console.log("Published price updates:", priceUpdatesArray);
    priceUpdates.clear();
  }
}, 100);

// {
// 	"price_updates": [{
// 		"asset": "BTC",
// 		"price": 1000000000,
// 		"decimal": 4,
// 	}, {
// 		"asset": "SOL",
// 		"price": 200000000,
// 		"decimal": 6,
// 	}]
// }
