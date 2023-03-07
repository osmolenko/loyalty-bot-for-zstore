const bwipjs = require("bwip-js")
const { startOptions, menuOptions } = require("./options")
const {
  connection,
  checkIfUserExists,
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

async function start(bot) {
  bot.on("message", async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    connection.query(checkIfUserExists(chatId), async function (error, result) {
      const user = result[0]

      if (msg.contact && !user) {
        await bot.sendMessage(chatId, phoneBind + msg.contact.phone_number)
        connection.query(getUserByPhone(msg), async function (error, result) {
          await bot.sendMessage(chatId, cardCreating)
          connection.query(addNewUser(msg), async function (error, result) {
            if (result) await bot.sendMessage(chatId, cardCreated, menuOptions)
          })
        })
      }

      try {
        switch (text) {
          case "/id":
            await bot.sendMessage(chatId, `Chat ID - ${chatId}`)
            break

          case "/start":
            if (user) {
              await bot.sendMessage(chatId, authorized, menuOptions)
            } else {
              await bot.sendSticker(chatId, telegramSticker)

              helloText.map(async (messageText) => {
                await bot.sendMessage(chatId, messageText, startOptions)
              })
            }
            break

          case buttons.loyaltyCard.text:
            bwipjs.toBuffer(
              {
                bcid: "code128",
                text: user.phone,
                scale: 3,
                height: 20,
                includetext: true,
                textxalign: "center",
                paddingwidth: 10,
                paddingheight: 10,
              },
              async function (err, png) {
                if (err) {
                  console.log(error)
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
              }
            )
            break

          case buttons.discount.text:
            if (user.discount) {
              await bot.sendMessage(
                chatId,
                `${buttons.discount.yes}${user.discount}%`
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
        console.log(error)
        return bot.sendMessage(chatId, "Виникла помилка")
      }
    })
  })
}

module.exports = {
  startTelegramBot: start,
}
