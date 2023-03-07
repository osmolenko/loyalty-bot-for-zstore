const { buttons, sharePhone } = require("./i18n")

module.exports = {
  startTelegramKeyboard: {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: sharePhone, request_contact: true }]],
    }),
  },

  menuTelegramKeyboard: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: buttons.loyaltyCard.text }],
        [{ text: buttons.discount.text }, { text: buttons.conditions.text }],
        [{ text: buttons.contacts.text }, { text: buttons.directions.text }],
      ],
    }),
  },

  startViberKeyboard: {
    "Type": "keyboard",
    "Revision": 1,
    "Buttons": [
      {
        "Columns": 6,
        "Rows": 2,
        "Text": sharePhone,
        "ActionType": "share-phone",
        "ActionBody": "Yes"
      }
      
    ]
  },
  menuViberKeyboard: {
    "Type": "keyboard",
    "Revision": 1,
    "Buttons": [
      {
        "Columns": 6,
        "Rows": 1,
        "Text": buttons.loyaltyCard.text,
        "ActionType": "reply",
        "ActionBody": buttons.loyaltyCard.text
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": buttons.discount.text,
        "ActionType": "reply",
        "ActionBody": buttons.discount.text
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": buttons.conditions.text,
        "ActionType": "reply",
        "ActionBody": buttons.conditions.text
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": buttons.contacts.text,
        "ActionType": "reply",
        "ActionBody": buttons.contacts.text
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": buttons.directions.text,
        "ActionType": "reply",
        "ActionBody": buttons.directions.text
      },
      
    ]
  }
}
