const bwipjs = require("bwip-js")
const fs = require("fs")
const path = require("path")
const { baseUrl } = require("./config")

function getBarcode(phone, callback) {
  bwipjs.toBuffer(
    {
      bcid: "code128",
      text: phone,
      scale: 4,
      height: 20,
      includetext: true,
      textxalign: "center",
      paddingwidth: 10,
      paddingheight: 10,
      backgroundcolor: "FFFFFF",
    },
    callback
  )
}

function getBarcodeUrl(phone, callback) {
  getBarcode(phone, async function (error, png) {
    if (error) {
      console.log(error)
    }

    if (!fs.existsSync(`${path.join(__dirname, "barcodes")}/${phone}.jpg`)) {
      fs.writeFile(
        `${path.join(__dirname, "barcodes")}/${phone}.jpg`,
        png,
        "binary",
        (error) => {
          console.log(error)
        }
      )
    }
    callback(`${baseUrl}/barcodes/${phone}.jpg`)
  })
}

module.exports = { getBarcode, getBarcodeUrl }
