/*
MySQL Connection to DB
*/


//requiring mysql package
var mysql      = require('mysql');

//Local or Heroku AWS
if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);
  var connection = new Sequelize(process.env.JAWSDB_URL);
} else {
  // LOCAL DB
  var connection = new Sequelize('virtual_flyer_db', 'root');
};

// var connection = mysql.createConnection(process.env.JAWSDB_URL || {
//   host     : 'localhost',
//   user     : 'root',
//   database : 'virtual_flyer_db'
// });




// var Sequelize = require('sequelize');
// var connection = new Sequelize('user_authentication_db', 'root');


connection.connect();
 
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log("Connection to DB made")
  console.log('The solution is: ', rows[0].solution);
});


//Registration
var User = connection.define('user', {
 first_name: {
  Sequelize.STRING
 },
 last_name: {
  Sequelize.STRING
 },
 student:{
  Sequelize.BOOLEAN
 },
 teacher:{
  Sequelize.BOOLEAN
 },
 city:{
  Sequelize.STRING
 },
 state: {
  Sequelize.STRING
 },
 email:{
  type: Sequelize.STRING,
    unique: true
 },
 password:{
  Sequelize.STRING
 },
 authenticated:{
  Sequelize.BOOLEAN
 }
})


User.findOne().then(function (user) {
    console.log(user.name);
});
module.exports = connection;