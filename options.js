const { buttons, sharePhone } = require("./i18n")

module.exports = {
  startOptions: {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: sharePhone, request_contact: true }]],
    }),
  },

  menuOptions: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: buttons.loyaltyCard.text }],
        [{ text: buttons.discount.text }, { text: buttons.conditions.text }],
        [{ text: buttons.contacts.text }, { text: buttons.directions.text }],
      ],
    }),
  },
}
