import { createClient } from "redis";

const redis = createClient();

let 

async function startEngine() {
  try {
    await redis.connect();
    console.log("Connected to Redis");
    await listenForMessages();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
}

async function listenForMessages() {
  let lastId = "$";

  while (true) {
    try {
      const response = await redis.xRead(
        {
          key: "queue1",
          id: lastId,
        },
        {
          BLOCK: 1000,
        }
      );

      if (!response || !Array.isArray(response) || response.length === 0) {
        continue;
      }

      const stream = response[0];
      if (
        stream &&
        typeof stream === "object" &&
        "messages" in stream &&
        Array.isArray(stream.messages) &&
        stream.messages.length > 0
      ) {
        console.log(stream.messages[0]);
      }
    } catch (error) {
      console.error("Error reading from stream:", error);
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

startEngine();
