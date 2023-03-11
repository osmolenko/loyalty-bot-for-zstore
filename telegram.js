const { startTelegramKeyboard, menuTelegramKeyboard } = require("./keyboards")
const {
  connection,
  checkIfTelegramUserExists,
  getUserByPhone,
  addNewUserFromTelegram,
  addTelegramBotToken,
} = require("./db")
const {
  telegramSticker,
  helloText,
  exist,
  nonexist,
  cardCreated,
  buttons,
  authorized,
} = require("./i18n")
const { getBarcode, createLogger } = require("./helper")

const winstonLogger = createLogger()

async function start(bot) {
  bot.on("message", async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    connection.query(
      // Перевіряємо чи є в БД юзер з чат-айді який звернувся
      checkIfTelegramUserExists(chatId),
      async function (error, result) {
        if (error) winstonLogger.error(error)

        const user = result[0]

        // Перевіряємо чи є повідомлення контактом і чи відправленний контакт === контакт що звернувся
        if (msg.contact && msg.contact.user_id === chatId) {
          // Забираємо з БД юзера по наданому номеру телефону
          connection.query(
            getUserByPhone(msg.contact.phone_number),
            async function (error, result) {
              if (error) winstonLogger.error(error)

              const userByPhone = result[0]

              // Якщо дані про юзера є в БД по номеру або чат-айді
              if (user || userByPhone) {
                await bot.sendMessage(
                  chatId,
                  exist.telegram.replace("{{phone}}", msg.contact.phone_number),
                  menuTelegramKeyboard
                )
                // Оновлюємо чат-айди юзера
                connection.query(
                  addTelegramBotToken(msg),
                  async function (error, result) {
                    if (error) winstonLogger.error(error)

                    if (result) {
                      await bot.sendMessage(
                        chatId,
                        cardCreated,
                        menuTelegramKeyboard
                      )
                    }
                  }
                )
                // Якщо юзера немає у БД
              } else {
                await bot.sendMessage(
                  chatId,
                  nonexist.telegram.replace(
                    "{{phone}}",
                    msg.contact.phone_number
                  ),
                  menuTelegramKeyboard
                )
                // Створюємо юзера і записуємо чат-айді
                connection.query(
                  addNewUserFromTelegram(msg),
                  async function (error, result) {
                    if (error) winstonLogger.error(error)

                    if (result) {
                      await bot.sendMessage(
                        chatId,
                        cardCreated,
                        menuTelegramKeyboard
                      )
                    }
                  }
                )
              }
            }
          )
        }

        try {
          switch (text) {
            case "/id":
              await bot.sendMessage(chatId, `Chat ID - ${chatId}`)
              break

            case "/start":
              if (user) {
                await bot.sendMessage(chatId, authorized, menuTelegramKeyboard)
                break
              }
              await bot.sendSticker(chatId, telegramSticker)

              helloText.map(async (messageText) => {
                await bot.sendMessage(
                  chatId,
                  messageText,
                  startTelegramKeyboard
                )
              })
              break

            case buttons.loyaltyCard.text:
              getBarcode(user.phone, async function (error, png) {
                if (error) {
                  winstonLogger.error(error)
                } else {
                  bot
                    .sendPhoto(chatId, png, {
                      caption: buttons.loyaltyCard.response,
                    })
                    .then((e) => {
                      bot.unpinAllChatMessages(chatId)
                      bot.pinChatMessage(chatId, e.message_id)
                    })
                }
              })
              break

            case buttons.discount.text:
              if (user.discount) {
                await bot.sendMessage(
                  chatId,
                  `${buttons.discount.yes.replace(
                    "{{discount}}",
                    user.discount
                  )}`
                )
              } else {
                await bot.sendMessage(chatId, buttons.discount.no)
              }

              break

            case buttons.conditions.text:
              buttons.conditions.response.map(async (messageText) => {
                await bot.sendMessage(chatId, messageText)
              })
              break

            case buttons.contacts.text:
              buttons.contacts.response.map(async (messageText) => {
                await bot.sendMessage(chatId, messageText)
              })
              break

            case buttons.directions.text:
              buttons.directions.response.map(async (messageText) => {
                await bot.sendMessage(chatId, messageText)
              })
              break

            default:
              break
          }
        } catch (error) {
          winstonLogger.error(error)
          return bot.sendMessage(chatId, "Виникла помилка")
        }
      }
    )
  })
}

module.exports = {
  startTelegramBot: start,
}
