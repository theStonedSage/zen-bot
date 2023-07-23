const { readdirSync } = require("fs");

module.exports = (client) => {
  const componentsFolder = readdirSync("./src/components");
  componentsFolder.forEach((folder) => {
    const componentFiles = readdirSync(`./src/components/${folder}`).filter(
      (file) => file.endsWith(".js")
    );
    const { buttons } = client;
    switch (folder) {
      case "buttons":
        componentFiles.forEach((file) => {
          const button = require(`../components/${folder}/${file}`);
          buttons.set(button.data.name, button);
        });
        break;
      default:
        break;
    }
  });
};
