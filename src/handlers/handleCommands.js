const fs = require("fs");
import path from "node:path";

module.exports = (client) => {
    const commandFiles = fs.readdirSync("./src/commands").filter((file) => file.endsWith(".js"));
    commandFiles.forEach(file=>{
        const command = require(`../commands/${file}`);
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
        } else {
          Logger.warn(
            `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
          );
        }
      })
};
