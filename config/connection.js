/*
MySQL Connection to DB
*/
debugger

var Sequelize = require('sequelize');

//Local or Heroku AWS
if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);
  var connection = new Sequelize(process.env.JAWSDB_URL);
} else {
  // LOCAL DB
  var connection = new Sequelize('virtual_flyer_db', 'root');
};

/*
Model
*/

//Registration
var User = connection.define('user', {
 first_name: Sequelize.STRING,
 last_name: Sequelize.STRING,
 student: Sequelize.BOOLEAN,
 teacher: Sequelize.BOOLEAN,
 city: Sequelize.STRING,
 state: Sequelize.STRING,
 email: {
  type: Sequelize.STRING,
  unique: true,
  allowNull: false
  //validate
  // validate: {
  //   notEmpty: true,
  //   len: {  //set validation range and error message
  //     arguments: [1,25],
  //     message: "Please enter an email "

  //   },
 },
 password: Sequelize.STRING,
 authenticated: Sequelize.BOOLEAN
});

// var Place = connection.define('place', {

// });

var db = {
  User: User,
  //Place: Place,
  connection: connection
}

// User.findOne().then(function (user) {
//     console.log(user.name);
// });

module.exports = db;