const { EmbedBuilder } = require("@discordjs/builders");
const { ButtonBuilder, ButtonStyle } = require("discord.js");
const {
  forOwn,
  camelCase,
  forEach,
  isArray,
  isObject,
  get,
  truncate,
  mapValues,
  map,
  isNumber,
} = require("lodash");
const { DISCORD_EMBED_LIMITS } = require("../constants");

const generateEmbed = (data) => {
  const transformedData = transformEmbedData(data);
  return new EmbedBuilder(transformedData);
};

const truncateText = (limit, val) =>
  isNumber(limit)
    ? truncate(val, {
        length: limit,
      })
    : val;

const transformEmbedData = (data) =>
  mapValues(data, (val, key) => {
    if (isArray(val)) {
      map(val, (obj) =>
        forEach(obj, (subVal, subKey) => {
          const subKeyToCheck = [key, subKey].join(".");
          const limit = get(DISCORD_EMBED_LIMITS, subKeyToCheck);
          obj[subKey] = truncateText(limit, subVal);
        })
      );
    } else if (isObject(val)) {
      val = mapValues(val, (subVal, subKey) => {
        const subKeyToCheck = [key, subKey].join(".");
        const limit = get(DISCORD_EMBED_LIMITS, subKeyToCheck);
        subVal = truncateText(limit, subVal);
        return subVal;
      });
    } else {
      const limit = get(DISCORD_EMBED_LIMITS, key);
      val = truncateText(limit, val);
    }
    return val;
  });

const generateButton = (data) => {
  const { label, customId, emoji } = data;
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(emoji);
};

module.exports = {
  transformEmbedData,
  generateEmbed,
  generateButton,
};
