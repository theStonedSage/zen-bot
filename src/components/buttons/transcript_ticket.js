const discordTranscripts = require("discord-html-transcripts");
const { THEME } = require("../../utils/constants");
const { generateEmbed } = require("../../utils/helpers/discordHelpers");

module.exports = {
  data: {
    name: "transcript_ticket",
  },
  async execute(interaction) {
    const currentChannel = interaction.channel;
    const transcriptEmbed = generateEmbed({
      color: THEME.PRIMARY,
      description: "You can download the transcipt below",
    });

    try {
      const attachment = await discordTranscripts.createTranscript(
        currentChannel
      );

      interaction.reply({
        files: [attachment],
        embeds: [transcriptEmbed],
      });
    } catch (err) {
      const transcriptFailedEmbed = generateEmbed({
        color: THEME.PRIMARY,
        description: err.message
      })
      return await interaction.reply({
        embeds: [transcriptFailedEmbed],
      });
    }
  },
};
