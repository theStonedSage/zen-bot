const { SlashCommandBuilder, ChannelType } = require("discord.js");
const { isEmpty } = require("lodash");
const { getTickets } = require("../api/tickets");
const { ZEN_CATEGORY_NAME } = require("../utils/constants");
const logger = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-zen")
    .setDescription("Delete all zendesk ticket channels ( not archives )"),
  async execute(interaction) {
    await interaction.deferReply();
    try {
        let zenCategory = interaction.member.guild.channels.cache.find(
            (channel) => channel.name === ZEN_CATEGORY_NAME
        );

        if(isEmpty(zenCategory)){
            return await interaction.editReply("No Channels to be deleted");
        }

      interaction.member.guild.channels.cache.forEach(
        async (channel) => {
            if(channel.parentId === zenCategory.id){
               await channel.delete();
            }
        }
      );

      await zenCategory.delete();
      await interaction.editReply("Deleted All ticket channels");
    } catch (err) {
      logger.error(err.message);
    }
  },
};
