const BotEvents = require("viber-bot").Events
const TextMessage = require("viber-bot").Message.Text
const PictureMessage = require("viber-bot").Message.Picture
const { startViberKeyboard, menuViberKeyboard } = require("./keyboards")
const {
  connection,
  checkIfViberUserExists,
  getUserByPhone,
  addViberBotToken,
} = require("./db")
const { helloText, cardCreated, buttons, exist, nonexist } = require("./i18n")
const { getBarcodeUrl } = require("./helper")

function start(viberBot) {
  viberBot.on(BotEvents.CONVERSATION_STARTED, (response) => {
    helloText.map((message) => {
      response
        .send(new TextMessage(message, startViberKeyboard, null, null, null, 6))
        .catch((e) => {
          console.log(e)
        })
    })
  })

  viberBot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    const chatId = response.userProfile.id
    const text = message.text

    connection.query(
      checkIfViberUserExists(chatId),
      async function (error, result) {
        const user = result[0]

        // Перевіряємо чи є повідомлення контактом
        if (message.contactPhoneNumber) {
          // Перевіряємо чи відправленний контакт === контакт що звернувся
          if (
            message.contactName === response.userProfile.name ||
            message.contactName === undefined
          ) {
            // Забираємо з БД юзера по наданому номеру телефону
            connection.query(
              getUserByPhone(message.contactPhoneNumber),
              function (error, result) {
                const userByPhone = result[0]
                // Якщо дані про юзера є в БД по номеру або чат-айді
                if (user || userByPhone) {
                  response.send(
                    new TextMessage(
                      exist.viber.replace(
                        "{{phone}}",
                        message.contactPhoneNumber
                      ),
                      menuViberKeyboard,
                      null,
                      null,
                      null,
                      6
                    )
                  )
                  // Оновлюємо чат-айди юзера
                  connection.query(
                    addViberBotToken(message, response),
                    function (error, result) {
                      if (result) {
                        response.send(
                          new TextMessage(
                            cardCreated,
                            menuViberKeyboard,
                            null,
                            null,
                            null,
                            6
                          )
                        )
                      }
                    }
                  )
                }
              }
            )
          } else {
            response.send(
              new TextMessage(
                nonexist.viber.replace("{{phone}}", message.contactPhoneNumber),
                menuViberKeyboard,
                null,
                null,
                null,
                6
              )
            )
            connection.query(
              addNewUserFromViber(message, response),
              function (error, result) {
                if (result) {
                  response.send(
                    new TextMessage(
                      cardCreated,
                      menuViberKeyboard,
                      null,
                      null,
                      null,
                      6
                    )
                  )
                }
              }
            )
          }
        }

        try {
          switch (text) {
            case buttons.loyaltyCard.text:
              getBarcodeUrl(user.phone, function (barcodeUrl) {
                response
                  .send(
                    new PictureMessage(
                      barcodeUrl,
                      buttons.loyaltyCard.response,
                      null,
                      menuViberKeyboard
                    )
                  )
                  .catch((e) => console.log(e))
              })
              break

            case buttons.discount.text:
              if (user.discount) {
                response.send(
                  new TextMessage(
                    `${buttons.discount.yes.replace(
                      "{{discount}}",
                      user.discount
                    )}`,
                    menuViberKeyboard,
                    null,
                    null,
                    null,
                    6
                  )
                )
              } else {
                response.send(
                  new TextMessage(
                    buttons.discount.no,
                    menuViberKeyboard,
                    null,
                    null,
                    null,
                    6
                  )
                )
              }

              break

            case buttons.conditions.text:
              buttons.conditions.response.map(async (messageText) => {
                response.send(
                  new TextMessage(
                    messageText,
                    menuViberKeyboard,
                    null,
                    null,
                    null,
                    6
                  )
                )
              })
              break

            case buttons.contacts.text:
              buttons.contacts.response.map(async (messageText) => {
                response.send(
                  new TextMessage(
                    messageText,
                    menuViberKeyboard,
                    null,
                    null,
                    null,
                    6
                  )
                )
              })
              break

            case buttons.directions.text:
              buttons.directions.response.map(async (messageText) => {
                response.send(
                  new TextMessage(
                    messageText,
                    menuViberKeyboard,
                    null,
                    null,
                    null,
                    6
                  )
                )
              })
              break
          }
        } catch (error) {
          console.log(error)
          return bot.sendMessage(chatId, "Виникла помилка")
        }
      }
    )
  })
}

module.exports = {
  startViberBot: start,
}
