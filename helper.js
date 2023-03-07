const bwipjs = require("bwip-js")

function getBarcode(phone, callback) {
  bwipjs.toBuffer(
    {
      bcid: "code128",
      text: phone,
      scale: 3,
      height: 20,
      includetext: true,
      textxalign: "center",
      paddingwidth: 10,
      paddingheight: 10,
    },
    callback
  )
}

module.exports = { getBarcode }
