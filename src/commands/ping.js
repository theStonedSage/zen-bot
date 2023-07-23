const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { generateButton } = require('../utils/helpers/discordHelpers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const button = generateButton({label:'Close',customId:'close_ticket',emoji:'🔒'});
		await interaction.reply({
			components:[new ActionRowBuilder().addComponents(button)],
			embeds:[embed]
		})
	},
};