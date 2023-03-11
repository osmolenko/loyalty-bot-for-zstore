const bwipjs = require("bwip-js")
const fs = require("fs")
const path = require("path")
const winston = require("winston")
const { consoleFormat } = require("winston-console-format")
const TelegramLogger = require("winston-telegram")
const { baseUrl, loggerChatId, telegramLoggerBotToken } = require("./config")

const winstonLogger = createLogger()

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
      winstonLogger.error(error)
    }

    if (!fs.existsSync(`${path.join(__dirname, "barcodes")}/${phone}.jpg`)) {
      fs.writeFile(
        `${path.join(__dirname, "barcodes")}/${phone}.jpg`,
        png,
        "binary",
        (error) => {
          winstonLogger.error(error)
        }
      )
    }
    callback(`${baseUrl}/barcodes/${phone}.jpg`)
  })
}

function createLogger() {
  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        timestamp: true,
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.padLevels(),
          consoleFormat({
            timestamp: true,
            showMeta: true,
            metaStrip: ["timestamp", "service"],
            inspectOptions: {
              depth: Infinity,
              colors: true,
              maxArrayLength: Infinity,
              breakLength: 120,
              compact: Infinity,
            },
          })
        ),
      }),
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  })
  if (telegramLoggerBotToken.length > 0) {
    logger.add(
      new TelegramLogger({
        token: telegramLoggerBotToken,
        chatId: loggerChatId,
      })
    )
  }
  return logger
}

module.exports = { getBarcode, getBarcodeUrl, createLogger }
