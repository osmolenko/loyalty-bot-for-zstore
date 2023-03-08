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
        "Text": `<font size="24" color="#0047AB"><b>${sharePhone}</b></font>`,
        "ActionType": "share-phone",
        "ActionBody": "Yes",
        "TextSize": "large",
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      }
      
    ]
  },
  menuViberKeyboard: {
    "Type": "keyboard",
    "Revision": 1,
    "BgColor": "#B5B8B1",
    "Buttons": [
      {
        "Columns": 6,
        "Rows": 1,
        "Text": `<font size="20" color="#0047AB"><b>${buttons.loyaltyCard.text}</b></font>`,
        "BgColor": "#FFFFFF",
        "ActionType": "reply",
        "ActionBody": buttons.loyaltyCard.text,
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": `<font size="20" color="#0047AB"><b>${buttons.discount.text}</b></font>`,
        "BgColor": "#FFFFFF",
        "ActionType": "reply",
        "ActionBody": buttons.discount.text,
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": `<font size="20" color="#0047AB"><b>${buttons.conditions.text}</b></font>`,
        "BgColor": "#FFFFFF",
        "ActionType": "reply",
        "ActionBody": buttons.conditions.text,
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": `<font size="20" color="#0047AB"><b>${buttons.contacts.text}</b></font>`,
        "BgColor": "#FFFFFF",
        "ActionType": "reply",
        "ActionBody": buttons.contacts.text,
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      },
      {
        "Columns": 3,
        "Rows": 1,
        "Text": `<font size="20" color="#0047AB"><b>${buttons.directions.text}</b></font>`,
        "BgColor": "#FFFFFF",
        "ActionType": "reply",
        "ActionBody": buttons.directions.text,
        "Frame": {
          "BorderWidth": "05",
          "BorderColor": "#0047AB",
          "CornerRadius": "10"
          },
      },
      
    ]
  }
}
