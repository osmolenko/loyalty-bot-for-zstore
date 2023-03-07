const BotEvents = require("viber-bot").Events
const TextMessage = require("viber-bot").Message.Text
const KeyboardMessage = require("viber-bot").Message.Keyboard
const RichMediaMessage = require("viber-bot").Message.RichMedia
const { startViberKeyboard, menuViberKeyboard } = require("./keyboards")
const {
  connection,
  checkIfViberUserExists,
  getUserByPhone,
  addNewUser,
} = require("./db")
const {
  telegramSticker,
  helloText,
  phoneBind,
  cardCreating,
  cardCreated,
  authorized,
  buttons,
} = require("./i18n")

function start(viberBot) {
  viberBot.on(BotEvents.SUBSCRIBED, (response) => {
    helloText.map((message) => {
      response
        .send(new TextMessage(message, menuViberKeyboard, null, null, null, 3))
        .catch((e) => {
          console.log(e)
        })
    })
  })

  viberBot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    const chatId = response.userProfile.id
    const text = message.text

    if (message.contactPhoneNumber) {
      console.log(message.contactPhoneNumber)
    }

    connection.query(getUser(chatId), function (error, result) {
      const user = result[0]

      console.log(message.text)

      switch (text) {
        // case buttons.discount.text:
        //   if (user.discount) {
        //     await bot.sendMessage(
        //       chatId,
        //       `${buttons.discount.yes}${user.discount}%`
        //     )
        //   } else {
        //     await bot.sendMessage(chatId, buttons.discount.no)
        //   }

        //   break

        case buttons.conditions.text:
          buttons.conditions.response.map(async (messageText) => {
            response
              .send(
                new TextMessage(
                  messageText,
                  menuViberKeyboard,
                  null,
                  null,
                  null,
                  3
                )
              )
              .catch((e) => {
                console.log(e)
              })
          })
          break

        case buttons.contacts.text:
          buttons.contacts.response.map(async (messageText) => {
            response
              .send(
                new TextMessage(
                  messageText,
                  menuViberKeyboard,
                  null,
                  null,
                  null,
                  3
                )
              )
              .catch((e) => {
                console.log(e)
              })
          })
          break

        case buttons.directions.text:
          buttons.directions.response.map(async (messageText) => {
            response
              .send(
                new TextMessage(
                  messageText,
                  menuViberKeyboard,
                  null,
                  null,
                  null,
                  3
                )
              )
              .catch((e) => {
                console.log(e)
              })
          })
          break

        default:
          break
      }
    })
  })
}

module.exports = {
  startViberBot: start,
}
