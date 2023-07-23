import { get, isEmpty } from "lodash";
import { getTicketComments, getTicketDetails } from "../api/tickets";
import Logger from "../utils/logger";
import {
  checkIfTicketChannel,
  createTicketCommentEmbed,
  createTicketEmbed,
  getIdFromTicketChannel,
  parseTicketComment,
} from "../utils/helpers";
import { generateButton } from "../utils/helpers/discordHelpers";
const {
  ChannelType,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "channelCreate",
  async execute(channel) {
    if ([ChannelType.GuildCategory].includes(channel.type)) return;

    const isTicketChannel = checkIfTicketChannel(channel.name);
    if (!isTicketChannel) return;

    const ticketId = getIdFromTicketChannel(channel.name);

    try {
      const [{ data: detailsResp }, { data: commentsResp }] = await Promise.all(
        [getTicketDetails(ticketId), getTicketComments(ticketId)]
      );
      const assignee = get(detailsResp,"ticket.via.source.to");

      const parsedTicketComments = get(commentsResp, "comments").map(
        (comment) => parseTicketComment(comment,assignee)
      );

      const ticketDetails = detailsResp?.ticket;
      if (isEmpty(ticketDetails)) return;

      const button = generateButton({label:'Close',customId:'close_ticket',emoji:'🔒'});

      const ticketEmbed = createTicketEmbed(ticketDetails);
      await channel.send({
        embeds: [ticketEmbed],
        components: [new ActionRowBuilder().addComponents(button)],
      });

      parsedTicketComments?.map(async (comment) => {
        const commentEmbed = createTicketCommentEmbed(comment);
        await channel.send({ embeds: [commentEmbed] });
      });
      
    } catch (err) {
      Logger.error(err.message);
      return;
    }
  },
};
