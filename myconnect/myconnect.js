const mysql = require('mysql');

// local
// const host = "localhost";
// const user = "root";
// const password = "";
// const database = "shopping";


// server
const host = "27.254.38.3";
const user = "phanecho_shopx";
const password = "sarawut0304";
const database = "phanecho_shopx";

const db = mysql.createConnection({
    user: user,
    host: host,
    password: password,
    database: database
}) 

module.exports = db;