/*
MySQL Connection to DB
*/


//requiring mysql package
var mysql      = require('mysql');

var connection = mysql.createConnection(process.env.JAWSDB_URL || {
  host     : 'localhost',
  user     : 'root',
  database : 'virtual_flyer_db'
});
 
connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log("Connection to DB made")
  console.log('The solution is: ', rows[0].solution);
});

 


module.exports = connection;