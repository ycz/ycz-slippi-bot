import dotenv from "dotenv";
import tmi from "tmi.js";
// import { commandProcessor } from "./commands.js";

dotenv.config();

// Define configuration options
const opts = {
  options: { debug: true, messagesLogLevel: "info" },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

const setupClient = () => {
  // Create a client with our options
  const client = new tmi.client(opts);

  console.log("Connecting to Twitch...");
  // Register our event handlers (defined below)
  client.on("connected", onConnectedHandler);

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to Twitch at ${addr}:${port}`);
  }

  client.connect().catch(console.error);

  return client;
};

const client = setupClient();

export default client;
