// ====== FOR LOCAL =======
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "letmein12345",
  database: "full_stack_project",
  connectionLimit: 10, // allow multiple connections
  namedPlaceholders: true, // allow us to pass parameters when write query
});

module.exports = db;

// ======== For Docker ===============
// const mysql = require('mysql2/promise');
// const db = mysql.createPool({
//     host: "db",
//     user: "root",
//     password: "letmein12345",
//     database: "full_stack_project",
//     port: 3306,
//     // connectionLimit: 10,      // allow multiple connections
//     namedPlaceholders: true   // allow us to pass parameters when write query
// })

// module.exports = db;
