const axios = require("axios");

const zenApi = axios.create({
  baseURL: process.env.API_BASE_URL,
  auth:{
    username: process.env.ZENDESK_EMAIL,
    password: process.env.ZENDESK_PASSWORD
  }
});

module.exports = {
    zenApi
}
