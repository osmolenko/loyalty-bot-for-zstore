const BotEvents = require("viber-bot").Events
const TextMessage = require("viber-bot").Message.Text
const PictureMessage = require("viber-bot").Message.Picture
const { startViberKeyboard, menuViberKeyboard } = require("./keyboards")
const {
  connection,
  checkIfViberUserExists,
  getUserByPhone,
  addViberBotToken,
  addNewUserFromViber,
} = require("./db")
const { helloText, cardCreated, buttons, exist, nonexist } = require("./i18n")
const { getBarcodeUrl, createLogger } = require("./helper")

const winstonLogger = createLogger()

function start(viberBot) {
  viberBot.on(BotEvents.CONVERSATION_STARTED, (response) => {
    helloText.map((message) => {
      response
        .send(new TextMessage(message, startViberKeyboard, null, null, null, 6))
        .catch((error) => {
          winstonLogger.error(error)
        })
    })
  })

  viberBot.on(BotEvents.SUBSCRIBED, (response) => {
    helloText.map((message) => {
      response
        .send(new TextMessage(message, startViberKeyboard, null, null, null, 6))
        .catch((error) => {
          winstonLogger.error(error)
        })
    })
  })

  viberBot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
    const chatId = response.userProfile.id
    const text = message.text

    connection.query(
      checkIfViberUserExists(chatId),
      async function (error, result) {
        if (error) winstonLogger.error(error)

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
                if (error) winstonLogger.error(error)

                const userByPhone = result[0]
                // Якщо дані про юзера є в БД по номеру або чат-айді
                if (user || userByPhone) {
                  response
                    .send(
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
                    .catch((error) => {
                      winstonLogger.error(error)
                    })
                  // Оновлюємо чат-айди юзера
                  connection.query(
                    addViberBotToken(message, response),
                    function (error, result) {
                      if (error) winstonLogger.error(error)
                      if (result) {
                        response
                          .send(
                            new TextMessage(
                              cardCreated,
                              menuViberKeyboard,
                              null,
                              null,
                              null,
                              6
                            )
                          )
                          .catch((error) => {
                            winstonLogger.error(error)
                          })
                      }
                    }
                  )
                } else {
                  response
                    .send(
                      new TextMessage(
                        nonexist.viber.replace(
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
                    .catch((error) => {
                      winstonLogger.error(error)
                    })

                  connection.query(
                    addNewUserFromViber(message, response),
                    function (error, result) {
                      if (error) winstonLogger.error(error)

                      if (result) {
                        winstonLogger.info(
                          `New user -> ${message.contactPhoneNumber}`
                        )
                        response
                          .send(
                            new TextMessage(
                              cardCreated,
                              menuViberKeyboard,
                              null,
                              null,
                              null,
                              6
                            )
                          )
                          .catch((error) => {
                            winstonLogger.error(error)
                          })
                      }
                    }
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
                  .catch((error) => {
                    winstonLogger.error(error)
                  })
              })
              break

            case buttons.discount.text:
              if (user.discount) {
                response
                  .send(
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
                  .catch((error) => {
                    winstonLogger.error(error)
                  })
              } else {
                response
                  .send(
                    new TextMessage(
                      buttons.discount.no,
                      menuViberKeyboard,
                      null,
                      null,
                      null,
                      6
                    )
                  )
                  .catch((error) => {
                    winstonLogger.error(error)
                  })
              }

              break

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
                      6
                    )
                  )
                  .catch((error) => {
                    winstonLogger.error(error)
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
                      6
                    )
                  )
                  .catch((error) => {
                    winstonLogger.error(error)
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
                      6
                    )
                  )
                  .catch((error) => {
                    winstonLogger.error(error)
                  })
              })
              break
          }
        } catch (error) {
          winstonLogger.error(error)
          response
            .send(
              new TextMessage(
                "Виникла помилка",
                menuViberKeyboard,
                null,
                null,
                null,
                6
              )
            )
            .catch((error) => {
              winstonLogger.error(error)
            })
        }
      }
    )
  })
}

module.exports = {
  startViberBot: start,
}
