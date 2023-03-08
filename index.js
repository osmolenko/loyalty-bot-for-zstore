const TelegramApi = require("node-telegram-bot-api")
const { baseUrl, telegramBotToken, viberBotToken } = require("./config")
const { startTelegramBot } = require("./telegram")
const { startViberBot } = require("./viber")
const ViberBot = require("viber-bot").Bot
const express = require("express")
const path = require("path")

if (telegramBotToken.length > 0) {
  const telegramBot = new TelegramApi(telegramBotToken, {
    polling: {
      params: {
        limit: 2,
      },
    },
  })

  startTelegramBot(telegramBot)
}

if (viberBotToken.length > 0) {
  console.log(`${baseUrl}/images/favicon.jpg`)

  const viberBot = new ViberBot({
    authToken: viberBotToken,
    name: "VivaSport - спортивні товари",
    avatar: `${baseUrl}/images/favicon.jpg`,
  })

  const app = express()
  const port = process.env.PORT || 3000
  app.use("/viber/webhook", viberBot.middleware())
  app.use("/barcodes", express.static(path.join(__dirname, "barcodes")))
  app.use("/images", express.static(path.join(__dirname, "images")))

  app.listen(port, () => {
    console.log(`Application running on port: ${port}`)
    viberBot.setWebhook(`${baseUrl}/viber/webhook`).catch((error) => {
      console.log("Can not set webhook on following server. Is it running?")
      console.error(error)
      process.exit(1)
    })
  })

  startViberBot(viberBot)
}

if (telegramBotToken.length <= 0 && viberBotToken.length <= 0) {
  console.error("Не задано токени ботів")
  process.exit(1)
}
