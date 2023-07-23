const { ActionRowBuilder } = require("discord.js");
const { get } = require("lodash");
const { THEME } = require("../../utils/constants");
const {
  checkIfTicketChannel,
  getIdFromTicketChannel,
  generateClosedChannelName,
} = require("../../utils/helpers");
const {
  generateEmbed,
  generateButton,
} = require("../../utils/helpers/discordHelpers");

module.exports = {
  data: {
    name: "close_ticket",
  },
  async execute(interaction) {
    try {
      const channelName = get(interaction, "channel.name");

      const ticketId = getIdFromTicketChannel(channelName);
      await changeTicketStatus(ticketId,"closed");

      const closedChannelName = generateClosedChannelName(channelName);
      await interaction?.channel?.setName(closedChannelName);

      const ticketClosedEmbed = generateEmbed({
        color: THEME.PRIMARY,
        description: `Ticket Closed by <@${get(interaction, "user.id")}>`,
      });

      const buttonDelete = generateButton({
        label: "Delete",
        customId: "delete_ticket",
        emoji: "⛔",
      });
      const buttonArchive = generateButton({
        label: "Archive",
        customId: "archive_ticket",
        emoji: "📝",
      });
      const buttonReOpen = generateButton({
        label: "Reopen",
        customId: "reopen_ticket",
        emoji: "🔒",
      });
      const buttonTranscript = generateButton({
        label: "Transcript",
        customId: "transcript_ticket",
        emoji: "🗂️",
      });

      await interaction.reply({
        embeds: [ticketClosedEmbed],
        components: [
          new ActionRowBuilder().addComponents(
            buttonTranscript,
            buttonReOpen,
            buttonArchive,
            buttonDelete
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
