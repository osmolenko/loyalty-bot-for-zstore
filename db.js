const {mysqlHost, mysqlUsername, mysqlPassword, mysqlDatabase} = require('./config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUsername,
    password: mysqlPassword,
    database: mysqlDatabase
  });


function checkIfUserExists(chatId) {
    const query = 
    `SELECT
        customer_id,
        customer_name,
        phone,
        ExtractValue (detail, '/detail/discount') as discount
    FROM
        customers 
    WHERE
        ExtractValue ( detail, '/detail/chat_id' ) = ${chatId}`
        return query
}



function getUserByPhone(msg) {
    const query = 
    `SELECT
        customers.customer_id
    FROM
        customers
    WHERE
        customers.phone = ${msg.contact.phone_number.slice(1)}`
    return query
}

function addNewUser(msg) {
    const query = 
        `INSERT INTO customers ( customer_name, phone, detail )
        VALUES (
                '${msg.contact.first_name}',
                '${msg.contact.phone_number.slice(1)}',
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
                    <holding_name><![CDATA[]]>
                    </holding_name><firstname>
                    <![CDATA[]]></firstname>
                    <lastname><![CDATA[]]>
                    </lastname><address>
                    <![CDATA[]]></address>
                    <comment><![CDATA[]]></comment>
                </detail>')`
    return query
}


module.exports = {
    connection,
    checkIfUserExists,
    getUserByPhone,
    addNewUser
}