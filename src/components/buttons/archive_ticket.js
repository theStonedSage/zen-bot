const { EmbedBuilder, ChannelType } = require("discord.js");
const { isEmpty, get } = require("lodash");
const {
  ZEN_ARCHIVE_CATEGORY_NAME,
  CLOSED_ZEN_TICKET_PREFIX,
  THEME,
} = require("../../utils/constants");
const Logger = require("../../utils/logger");

module.exports = {
  data: {
    name: "archive_ticket",
  },
  async execute(interaction) {
    try {
      const ticketArchiveEmbed = new EmbedBuilder().setColor(THEME.PRIMARY);

      const [channelPrefix] = interaction.channel.name.split("-");
      if (channelPrefix !== CLOSED_ZEN_TICKET_PREFIX) {
        ticketArchiveEmbed.setDescription(
          `Only Closed tickets can be archived`
        );
        return interaction.reply({
          embeds: [ticketArchiveEmbed],
        });
      }

      let zenCategory = interaction.member.guild.channels.cache.find(
        (channel) => channel.name === ZEN_ARCHIVE_CATEGORY_NAME
      );

      if (isEmpty(zenCategory)) {
        zenCategory = await interaction.member.guild.channels.create({
          name: ZEN_ARCHIVE_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
        });
      }

      if (interaction.channel.parentId === zenCategory.id) {
        ticketArchiveEmbed.setDescription(`Ticket Already Archived`);
      } else {
        await interaction?.channel?.setParent(zenCategory.id);
        ticketArchiveEmbed.setDescription(
          `Ticket Archived by <@${get(interaction, "user.id")}>`
        );
      }

      return interaction.reply({
        embeds: [ticketArchiveEmbed],
      });
    } catch (err) {
      Logger.error(err.message);
    }
  },
};
