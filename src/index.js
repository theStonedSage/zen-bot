import fs from "node:fs";
import path from "node:path";
import { getTickets } from "./api/tickets";
import { transformEmbedData } from "./utils/helpers/discordHelpers";
const { Client, Collection, GatewayIntentBits, ChannelType, Events } = require("discord.js");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 1234;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on(Events.ClientReady,()=>{
  const webhookRoutes = require('./routes/webhook');
  app.use('/webhook', webhookRoutes);
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);

module.exports = {
  client
}
