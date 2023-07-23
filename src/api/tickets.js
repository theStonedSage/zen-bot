const { zenApi } = require(".");

const params = {
  query: "type:ticket status:new status:open",
  sort_by: "created_at",
  sort_order: "desc",
}

const getTickets = async () => zenApi.get("/search.json?query=type:ticket",{params});
const getTicketDetails = async (id) => zenApi.get(`/tickets/${id}.json`);
const getTicketComments = async (id) => zenApi.get(`/tickets/${id}/comments`);

const addTicketComment = async (id, body) =>
  zenApi.put(`/tickets/${id}`, {
    ticket: {
      comment: {
        body,
        public: true,
      },
    },
  });

const changeTicketStatus = async (ticketId,status) => zenApi.put(`/tickets/${ticketId}`, {
  ticket: {
    status
  },
});

module.exports = {
  getTickets,
  getTicketDetails,
  addTicketComment,
  getTicketComments,
  changeTicketStatus
};
