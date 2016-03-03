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
  //LOCAL DB 
  var connection = new Sequelize('virtual_flyer_db', 'root');
};


/*
Model
*/

//Registration
//models
var User_test3 = connection.define('app-users', {
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
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
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  authenticated: {
    type: Sequelize.BOOLEAN,
    allowNull: false, 
    defaultValue: false
  }, 
}, {
  hooks: {
    beforeCreate: function(input) {
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }

});

var Venue = connection.define('venue', {
  venue_name: Sequelize.STRING,
  address_line: Sequelize.STRING,
  capacity: Sequelize.INTEGER,
  safe_space: Sequelize.STRING
});

var Event = connection.define('event',{
    event_name: Sequelize.STRING,
    event_day: Sequelize.STRING,
    event_date: Sequelize.DATE,
    start_time: Sequelize.TIME,
    end_time: Sequelize.TIME,
    artist1: Sequelize.STRING,
    artist2: Sequelize.STRING,
    artist3: Sequelize.STRING,
    genre: Sequelize.STRING,
    cost: Sequelize.DECIMAL
    // username: 
    //how can I make this refer to other table
});


//Creating db connection object to export to main 
var db = {
  User: User_test3,
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