const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { isEmpty } = require("lodash");
const { getTickets } = require("../api/tickets");
const { ZEN_CATEGORY_NAME } = require("../utils/constants");
const { getParsedTickets } = require("../utils/helpers");
const logger = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("zen")
    .setDescription("Setup zendesk in server"),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await getTickets();
      const ticketNames = getParsedTickets(res.data);

      let zenCategory = interaction.member.guild.channels.cache.find(
        (channel) => channel.name === ZEN_CATEGORY_NAME
      );
      if (isEmpty(zenCategory)) {
        zenCategory = await interaction.member.guild.channels.create({
          name: ZEN_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
        });
      }

      const channelCreatePromises = [];

      ticketNames.forEach((ticketName) => {
        const ticketChannel = interaction.member.guild.channels.cache.find(
          (channel) => channel.name === ticketName
        );
        if (isEmpty(ticketChannel)) {
          channelCreatePromises.push(
            interaction.member.guild.channels.create({
              name: ticketName,
              type: ChannelType.GuildText,
              parent: zenCategory.id,
              // your permission overwrites or other options here
            })
          );
        }
      });

      await Promise.all(channelCreatePromises);
      await interaction.editReply("Created all ticket channels");
    } catch (err) {
      logger.error(err.message);
    }
  },
};
