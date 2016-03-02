/*
MySQL Connection to DB
*/
debugger

var Sequelize = require('sequelize');
var PORT = process.env.PORT || 4040;

//Local or Heroku AWS
if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);
  var connection = new Sequelize(process.env.JAWSDB_URL);
  } else {
  //LOCAL DB
  var Sequelize = require('sequelize');  
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


//Creating db connection object to export to main 
var db = {
  User: User,
  //Place: Place,
  connection: connection
}; //end of db object

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
}); //end of test user



module.exports = db;