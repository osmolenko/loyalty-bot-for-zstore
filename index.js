const TelegramApi = require("node-telegram-bot-api")
const { telegramBotToken, viberBotToken } = require("./config")
const { startTelegramBot } = require("./telegram")

const telegramBot = new TelegramApi(telegramBotToken, {
  polling: {
    params: {
      limit: 2,
    },
  },
})

startTelegramBot(telegramBot)
