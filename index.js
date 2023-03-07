const TelegramApi = require("node-telegram-bot-api")
const { telegramBotToken, viberBotToken } = require("./config")
const { startTelegramBot } = require("./telegram")
const { startViberBot } = require("./viber")
const ViberBot = require("viber-bot").Bot
const express = require("express")

const telegramBot = new TelegramApi(telegramBotToken, {
  polling: {
    params: {
      limit: 2,
    },
  },
})

// const viberBot = new ViberBot({
//   authToken: viberBotToken,
//   name: "VivaSport - спортивні товари",
//   avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png",
// })

// const app = express()
// const port = process.env.PORT || 3000
// app.use("/viber/webhook", viberBot.middleware())

// app.listen(port, () => {
//   console.log(`Application running on port: ${port}`)
//   viberBot
//     .setWebhook(`https://2ffa-89-209-93-4.ngrok.io/viber/webhook`)
//     .catch((error) => {
//       console.log("Can not set webhook on following server. Is it running?")
//       console.error(error)
//       process.exit(1)
//     })
// })

startTelegramBot(telegramBot)
// startViberBot(viberBot)
