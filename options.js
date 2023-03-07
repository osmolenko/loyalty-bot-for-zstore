module.exports = {
  startOptions: {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: "Поділитись номером", request_contact: true }]],
    }),
  },

  menuOptions: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: "Моя картка лояльності" }],
        [{ text: "Моя знижка" }, { text: "Умови" }],
        [{ text: "Контакти" }, { text: "Як пройти?" }]
      ],
    }),
  },
};
