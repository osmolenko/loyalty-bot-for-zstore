const {mysqlHost, mysqlUsername, mysqlPassword, mysqlDatabase} = require('./config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUsername,
    password: mysqlPassword,
    database: mysqlDatabase
  });


function checkIfTelegramUserExists(chatId) {
    const query = 
    `SELECT
        customer_id,
        customer_name,
        phone,
        ExtractValue ( detail, '/detail/discount') as discount,
        ExtractValue ( detail, '/detail/chat_id' ) as telegram_chat_id,
        ExtractValue ( detail, '/detail/viber' ) as viber
    FROM
        customers 
    WHERE
        ExtractValue ( detail, '/detail/chat_id' ) = "${chatId}"`
        return query
}

function checkIfViberUserExists(chatId) {
    const query = 
    `SELECT
        customer_id,
        customer_name,
        phone,
        ExtractValue ( detail, '/detail/discount') as discount,
        ExtractValue ( detail, '/detail/chat_id' ) as telegram_chat_id,
        ExtractValue ( detail, '/detail/viber' ) as viber
    FROM
        customers 
    WHERE
        ExtractValue ( detail, '/detail/viber' ) = "${chatId}"`
        return query
}


function getUserByPhone(phone) {
    const query = 
    `SELECT
        customers.customer_id
    FROM
        customers
    WHERE
        customers.phone = '${phone.replace("+", "")}'`
    return query
}

function addTelegramBotToken(msg) {
    const query = `UPDATE customers 
    SET detail = (
        SELECT
        UpdateXML ( detail, '/detail/chat_id', '<chat_id>${msg.chat.id}</chat_id>' )) 
    WHERE
        customers.phone = '${msg.contact.phone_number.replace("+", "")}'`
    return query
}

function addViberBotToken(msg, res) {
    const query = `UPDATE customers 
    SET detail = (
        SELECT
        UpdateXML ( detail, '/detail/viber', '<viber>${res.userProfile.id}</viber>' )) 
    WHERE
        customers.phone = '${msg.contactPhoneNumber.replace("+", "")}'`
    return query
}

function addNewUserFromTelegram(msg, res) {
    const query = 
        `INSERT INTO customers ( customer_name, phone, detail )
        VALUES (
                '${msg.contact.first_name}',
                '${msg.contactPhoneNumber.replace("+", "")}',
                '<detail>
                    <code></code>
                    <type>1</type>
                    <fromlead>0</fromlead>
                    <jurid>0</jurid>
                    <shopcust_id></shopcust_id>
                    <isholding>0</isholding>
                    <holding>0</holding>
                    <viber></viber>
                    <nosubs>0</nosubs>
                    <allowedshop>0</allowedshop>
                    <edrpou></edrpou>
                    <user_id>4</user_id>
                    <chat_id>${msg.chat.id}</chat_id>
                    <pricetype>price1</pricetype>
                    <holding_name><![CDATA[]]></holding_name>
                    <firstname><![CDATA[]]></firstname>
                    <lastname><![CDATA[]]></lastname>
                    <address><![CDATA[]]></address>
                    <comment><![CDATA[]]></comment>
                </detail>')`
    return query
}

function addNewUserFromViber(msg, res) {
    const query = 
    `INSERT INTO customers ( customer_name, phone, detail )
    VALUES (
            '${res.userProfile.name}',
            '${msg.contactPhoneNumber.replace("+", "")}',
            '<detail>
                <code></code>
                <type>1</type>
                <fromlead>0</fromlead>
                <jurid>0</jurid>
                <shopcust_id></shopcust_id>
                <isholding>0</isholding>
                <holding>0</holding>
                <viber>${res.userProfile.id}</viber>
                <nosubs>0</nosubs>
                <allowedshop>0</allowedshop>
                <edrpou></edrpou>
                <user_id>4</user_id>
                <chat_id></chat_id>
                <pricetype>price1</pricetype>
                <holding_name><![CDATA[]]></holding_name>
                <firstname><![CDATA[]]></firstname>
                <lastname><![CDATA[]]></lastname>
                <address><![CDATA[]]></address>
                <comment><![CDATA[]]></comment>
            </detail>')`
            return query
}


module.exports = {
    connection,
    checkIfTelegramUserExists,
    checkIfViberUserExists,
    getUserByPhone,
    addTelegramBotToken,
    addViberBotToken,
    addNewUserFromTelegram,
    addNewUserFromViber,
}