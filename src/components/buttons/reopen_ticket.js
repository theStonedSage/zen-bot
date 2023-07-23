const { EmbedBuilder, ChannelType } = require("discord.js");
const { get, isEmpty } = require("lodash");
const { changeTicketStatus } = require("../../api/tickets");
const {
  ZEN_TICKET_PREFIX,
  ZEN_CATEGORY_NAME,
  THEME,
} = require("../../utils/constants");
const {
  getIdFromTicketChannel,
} = require("../../utils/helpers");
const Logger = require("../../utils/logger");

module.exports = {
  data: {
    name: "reopen_ticket",
  },
  async execute(interaction) {
    console.log("entered");
    try{
      const channelName = get(interaction, "channel.name", "");
      const ticketReopenedEmbed = new EmbedBuilder()
      .setColor(THEME.PRIMARY)
      
      const [currentPrefix, ...rest] = channelName.split("-");

      if(currentPrefix === ZEN_TICKET_PREFIX){
        ticketReopenedEmbed.setDescription(`Ticket is already open`);
        return await interaction.reply({
          embeds: [ticketReopenedEmbed],
        });
      }

  
      const reopenChannelName = [ZEN_TICKET_PREFIX, ...rest].join("-");
  
      //reopen the channel
      await changeTicketStatus(ticketId,"open");
  
      let zenCategory = interaction.member.guild.channels.cache.find(
        (channel) => channel.name === ZEN_CATEGORY_NAME
      );
      if (isEmpty(zenCategory)) {
        zenCategory = await interaction.member.guild.channels.create({
          name: ZEN_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
        });
      }

      await interaction?.channel?.setName(reopenChannelName);
      await interaction?.channel?.setParent(zenCategory.id);
  
      ticketReopenedEmbed.setDescription(`Ticket ReOpeaned by <@${get(interaction, "user.id")}>`);
  
      await interaction.reply({
        embeds: [ticketReopenedEmbed],
      });
    }catch(err){
      Logger.error(err.message);
    }
    
  },
};
