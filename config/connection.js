/*
MySQL Connection to DB
*/


//requiring mysql package
var mysql = require('mysql');
var PORT = process.env.PORT || 4040;
// var express = require('express');
// var app = express();

//Local or Heroku AWS
// if(process.env.NODE_ENV === 'production') {
//   // HEROKU DB
//   console.log(process.env.JAWSDB_URL);
//   var connection = new Sequelize(process.env.JAWSDB_URL);
// } else {
  // LOCAL DB
  var Sequelize = require('sequelize');  
  var connection = new Sequelize('virtual_flyer_db', 'root', 'atom828ye567');
// };

// var connection = mysql.createConnection(process.env.JAWSDB_URL || {
//   host     : 'localhost',
//   user     : 'root',
//   database : 'virtual_flyer_db'
// });


// Registration
// var User = connection.define('user', {
//  first_name: Sequelize.STRING,
//  last_name: Sequelize.STRING,
//  student:Sequelize.BOOLEAN,
//  teacher:Sequelize.BOOLEAN,
//  city:Sequelize.STRING,
//  state: Sequelize.STRING,
//  email: {
//   type: Sequelize.STRING,
//   unique: true
//   },
// password:Sequelize.STRING,
// authenticated:Sequelize.BOOLEAN
// });


// User.findOne().then(function (user) {
//     console.log(user.name);
// });

var Test_User = connection.define('test_user', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [5,20],
        msg: "Your password must be between 5-20 characters"
      },
    }
  },
  instructor_type: {
    type: Sequelize.STRING,
    allowNull: false
  }
// }, {
//   hooks: {
//     beforeCreate: function(input){
//       input.password = bcrypt.hashSync(input.password, 10);
//     }
//   }
});

connection.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
  });
});
module.exports = connection;