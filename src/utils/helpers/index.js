const moment = require("moment");
const { compact, get, isEmpty, last, lowerCase, startCase } = require("lodash");
const {
  CLOSED_ZEN_TICKET_PREFIX,
  ZEN_TICKET_PREFIX,
  THEME,
  MAX_EMBED_CHANNELS,
} = require("../constants");
const { generateEmbed } = require("./discordHelpers");

const getParsedTickets = (tickets) =>
  tickets.results
    .filter((_, i) => i < MAX_EMBED_CHANNELS)
    .map((ticket) =>
      generateChannelName(ticket.id)
    //   generateChannelName(ticket.id, populateAdditionalParams(ticket))
    );

const populateAdditionalParams = (ticket) => {
  const account = get(ticket, "via.source.to");
  const abbreviatedAccountName = startCase(
    account.name || account.username || ""
  )
    .split(" ")
    .map((name) => get(name, "0", ""))
    .join("");
  return compact([
    getSourceShorthand(ticket.via.channel),
    lowerCase(abbreviatedAccountName),
  ]);
};

const populateCommentsWithSource = (comments, src) =>
  comments.map((comment) => {
    const currentSource = get(comment, "via.source");
    if (isEmpty(currentSource)) {
      currentSource = src;
    }
    return currentSource;
  });

const createTicketEmbed = (ticketDetails) => {
  const author = get(ticketDetails, "via.source.from");

  const embedData = {
    color: THEME.PRIMARY,
    title: `Ticket #${ticketDetails.id}`,
    url: `https://knights.zendesk.com/agent/tickets/${ticketDetails.id}`,
    author: {
      name: author.username,
      icon_url: `https://unavatar.io/twitter/${author.username}`,
      url: author.profile_url,
    },
    description: ticketDetails.subject,
    fields: [
      {
        name: "channel",
        value: get(ticketDetails, "via.channel"),
      },
      { name: "\u200B", value: "\u200B" },
    ],
    footer: {
      text: moment(ticketDetails.created_at).format("MMM Do YYYY"),
    },
  };

  return generateEmbed(embedData);
};

const createTicketCommentEmbed = (ticketComment) =>
  generateEmbed({
    color: THEME.PRIMARY,
    author: {
      name:
        get(ticketComment, "from.name") ||
        get(ticketComment, "from.username", "User"),
      icon_url: `https://unavatar.io/twitter/${get(
        ticketComment,
        "from.username"
      )}`,
      ...(get(ticketComment, "from.profile_url") && {
        url: get(ticketComment, "from.profile_url"),
      }),
    },
    description: get(ticketComment, "msg"),
    footer: {
      text: get(ticketComment, "createdAt", Date.now()),
    },
  });
const parseTicketComment = (
  comment,
  via = {
    name: "user",
    username: "user",
  }
) => ({
  msg: get(comment, "body"),
  from: isEmpty(get(comment, "via.source.from"))
    ? via
    : get(comment, "via.source.from"),
  createdAt: moment(get(comment, "created_at", Date.now())).format(
    "MMM Do YYYY, h:mm a"
  ),
});

const checkIfTicketChannel = (name, ticketId = null) => {
  const [prefix, ...rest] = name.split("-");
  let isTicketIdValid = true;
  if (ticketId) {
    isTicketIdValid = rest.includes(String(ticketId));
  }
  return prefix === ZEN_TICKET_PREFIX && isTicketIdValid;
};

const generateChannelName = (ticketId, params = []) =>
  compact([ZEN_TICKET_PREFIX, ...params, ticketId]).join("-");

const generateClosedChannelName = (channelName) => {
  const [_, ...rest] = channelName.split("-");
  return [CLOSED_ZEN_TICKET_PREFIX, ...rest].join("-");
};

const getIdFromTicketChannel = (channelName) => last(channelName.split("-"));

const getSourceShorthand = (src) => src?.slice(0, 4);

module.exports = {
  getParsedTickets,
  populateAdditionalParams,
  populateCommentsWithSource,
  createTicketEmbed,
  createTicketCommentEmbed,
  parseTicketComment,
  checkIfTicketChannel,
  generateChannelName,
  generateClosedChannelName,
  getIdFromTicketChannel,
  getSourceShorthand,
};
