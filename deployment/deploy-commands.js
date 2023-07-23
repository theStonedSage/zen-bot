
// Deploy commands to a single Discord server.
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const Logger = require('../src/utils/logger')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.TOKEN

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`../src/commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);
-
// and deploy your commands!
(async () => {
	try {
		Logger.info(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		Logger.info(`Deploy Type: ${process.env.DEPLOY_TYPE}`)
		const data = await rest.put(
			process.env.DEPLOY_TYPE == 'single' ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId),
			{ body: commands },
		);

		Logger.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		Logger.error(error.message);
		console.log(error)
	}
})();