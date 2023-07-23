import { Events } from 'discord.js'
import handleComponents from '../handlers/handleComponents';
import handleCommands from '../handlers/handleCommands';
import Logger from '../utils/logger'

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		handleCommands(client);
		handleComponents(client);
		Logger.info(`Ready! Logged in as ${client.user.tag}`);
	},
};