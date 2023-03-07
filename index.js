const TelegramApi = require("node-telegram-bot-api");
const { startOptions, menuOptions } = require("./options");
const { telegramBotToken } = require("./config");
const {
  connection,
  checkIfUserExists,
  getUserByPhone,
  addNewUser,
} = require("./db");
const bwipjs = require("bwip-js");

const bot = new TelegramApi(telegramBotToken, {
  polling: {
    params: {
      limit: 2,
    },
  },
});

async function start() {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (msg.chat.type === "group") {
      await bot.sendMessage(
        chatId,
        "Я не працюю у групових чатах. Пишіть в особисті повідомлення"
      );
      await bot.sendMessage("400905943", "ПИДОРЫ ДОБАВИЛИ МЕНЯ В ГРУППУ");
      await bot.leaveChat(chatId);
      return;
    }

    await connection.query(
      checkIfUserExists(chatId),
      async function (error, result) {
        const user = result[0];

        if (msg.contact && !user) {
          await bot.sendMessage(
            chatId,
            `Ваша картка буде закріплена за номером телефону ${msg.contact.phone_number}`
          );
          await connection.query(
            getUserByPhone(msg),
            async function (error, result) {
              await bot.sendMessage(chatId, "Створюємо вашу картку...");
              await connection.query(
                addNewUser(msg),
                async function (error, result) {
                  if (result)
                    await bot.sendMessage(
                      chatId,
                      "Ваша картка створена! Приємного користування",
                      menuOptions
                    );
                }
              );
            }
          );
        }

        try {
          switch (text) {
            case "/id":
              await bot.sendMessage(chatId, `Chat ID - ${chatId}`);
              break;

            case "/start":
              if (user) {
                await bot.sendMessage(
                  chatId,
                  "Ви вже авторизовані!",
                  menuOptions
                );
              } else {
                await bot.sendSticker(
                  chatId,
                  "https://vivasport24.com.ua/content/images/2/400x200l50nn0/64200801019565.webp"
                );
                await bot.sendMessage(
                  chatId,
                  "Доброго дня! Вас вітає чат-бот магазину VivaSport!\nТут виможете знайти свою картку лояльності!\nТакож, саме тут ми інформуємо про нові акції та знижки!"
                );
                await bot.sendMessage(
                  chatId,
                  "Для того щоб отримати вашу картку поділіться своїм номером телефону!",
                  startOptions
                );
              }
              break;

            case "Моя картка лояльності":
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
                    console.log(error);
                  } else {
                    bot
                      .sendPhoto(chatId, png, {
                        caption: "Ваша картка лояльності",
                      })
                      .then((e) => {
                        bot.unpinAllChatMessages(chatId);
                        bot.pinChatMessage(chatId, e.message_id);
                      });
                  }
                }
              );
              break;

            case "Моя знижка":
              if (user.discount) {
                await bot.sendMessage(
                  chatId,
                  `Ваша персональна знижка - ${user.discount}%`
                );
              } else {
                await bot.sendMessage(chatId, "У вас ще немає знижки...");
              }

              break;

            case "Умови":
              await bot.sendMessage(chatId, "Умови - ");
              break;

            case "Контакти":
              await bot.sendMessage(chatId, "Контакти - ");
              break;

            case "Як пройти?":
              await bot.sendMessage(chatId, "Як пройти - ");
              break;

            default:
              break;
          }
        } catch (error) {
          console.log(error);
          return bot.sendMessage(chatId, "Виникла помилка");
        }
      }
    );
  });
}

start();
