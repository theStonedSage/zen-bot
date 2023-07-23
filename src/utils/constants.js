const ZEN_TICKET_PREFIX = "ticket";
const CLOSED_ZEN_TICKET_PREFIX = "closed";
const ZEN_CATEGORY_NAME = "zendesk";
const ZEN_ARCHIVE_CATEGORY_NAME = "zendesk-archives";

const MAX_EMBED_CHANNELS = 50;

const DISCORD_EMBED = {
  TITLE: "title",
  DESCRIPTION: "description",
  AUTHOR_NAME: "authorName",
  FIELD: "field",
  FIELD_NAME: "fieldName",
  FIELD_VALUE: "fieldValue",
  FOOTER: "footer",
};

const THEME = {
    PRIMARY : 0x0099ff
}

const DISCORD_EMBED_LIMITS = {
  title: 256,
  description: 3080,
  author: {
    name: 256,
  },
  fields: {
    name: 256,
    value: 1024,
  },
  footer: { text: 2048 },
  total: 6000,
};

const WEBHOOK_EVENTS = {
  COMMENT_ADDED: "comment_added",
  TICKET_CREATED: "ticket_created",
};

module.exports = {
  ZEN_TICKET_PREFIX,
  WEBHOOK_EVENTS,
  CLOSED_ZEN_TICKET_PREFIX,
  ZEN_CATEGORY_NAME,
  ZEN_ARCHIVE_CATEGORY_NAME,
  DISCORD_EMBED,
  DISCORD_EMBED_LIMITS,
  MAX_EMBED_CHANNELS,
  THEME
};
