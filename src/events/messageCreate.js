import { Events } from "discord.js";
import { get, isEmpty } from "lodash";
import { addTicketComment } from "../api/tickets";
import { checkIfTicketChannel, getIdFromTicketChannel } from "../utils/helpers";
import Logger from "../utils/logger";

module.exports = {
  name: "messageCreate",
  async execute(msg) {
    const isTicketChannel = checkIfTicketChannel(msg.channel.name);
    if (
      !isTicketChannel ||
      get(msg, "interaction.command") ||
      isEmpty(msg.content)
    )
      return;

    const ticketId = getIdFromTicketChannel(msg.channel.name);
    try {
      await addTicketComment(ticketId, msg.content);
    } catch (err) {
      Logger.info(`Error in sending message to zendesk: ${err.message}`);
    }
  },
};
