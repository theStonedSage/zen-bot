const { Events } = require("discord.js");
import Logger from "../utils/logger";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        Logger.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }
      console.log("entered", command);
      try {
        await command.execute(interaction);
      } catch (error) {
        Logger.error(`Error executing ${interaction.commandName}`);
        Logger.error(error.message);
        console.log(error);
      }
    } else if (interaction.isButton()) {
      const { buttons } = interaction.client;
      const { customId } = interaction;

      const button = buttons.get(customId);
      if (!button) {
        Logger.error("no button with custom id");
      }

      try {
        await button.execute(interaction);
      } catch (err) {
        Logger.error(err.message);
      }
    }
  },
};
