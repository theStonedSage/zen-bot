const express = require("express");
const router = express.Router();
import { compact, isEmpty } from "lodash";

const { client } = require('../index');

import {
  WEBHOOK_EVENTS,
  ZEN_CATEGORY_NAME,
} from "../utils/constants";
import {
  checkIfTicketChannel,
  createTicketCommentEmbed,
  generateChannelName,
} from "../utils/helpers";
import Logger from "../utils/logger";

router.post("/", async (req, res) => {
  const { type, ticketId, comment } = req.body;
  console.log("incomming_event", req.body);
  const discordServer = client.guilds.cache.get(process.env.GUILD_ID);

  switch (type) {
    case WEBHOOK_EVENTS.COMMENT_ADDED:
      {
        const { details, current_user_email } = comment;
        if (current_user_email.includes(process.env.AGENT_EMAIL_SUFFIX || "")) {
          return res.send("done");
        }

        const channel = discordServer?.channels?.cache?.find((channel) =>
          checkIfTicketChannel(channel.name, ticketId)
        );

        const [, sender, msg] = compact(details.split("\n"));
        const [name, ...date] = sender.split(", ");
        const commentParsed = {
          msg,
          from: {
            name: name,
            username: name.split(" ").join(""),
          },
          createdAt: date.join(" "),
        };

        const commentEmbed = createTicketCommentEmbed(commentParsed);
        await channel?.send({ embeds: [commentEmbed] });
      }
      break;
    case WEBHOOK_EVENTS.TICKET_CREATED:
      {
        try {
          const ticketChannelName = generateChannelName(ticketId, [
            "twit",
            "ka",
          ]);
          let zenCategory = discordServer.channels.cache.find(
            (channel) => channel.name === ZEN_CATEGORY_NAME
          );
          if (isEmpty(zenCategory)) return;
          await discordServer.channels.create({
            name: ticketChannelName,
            type: ChannelType.GuildText,
            parent: zenCategory.id,
          });
          Logger.info("succesfully created new ticket Channel");
        } catch (err) {
          Logger.error(err.message);
        }
      }
      break;
    default:
      break;
  }
  res.send("done");
});

module.exports = router;
