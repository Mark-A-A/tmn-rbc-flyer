/*
MySQL Connection to DB
*/


var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

//Local or Heroku AWS
if(process.env.NODE_ENV === 'production') {
  // HEROKU DB
  console.log(process.env.JAWSDB_URL);
  var connection = new Sequelize(process.env.JAWSDB_URL);
  } else {
  //LOCAL DB
  var connection = new Sequelize('virtual_flyer_db', 'root' , 'chronoprint2594');
};


/*
Model
*/

//Registration
//models
var User_test = connection.define('app-users', {
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
    beforeCreate: function (input) {
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }

});

var Place = connection.define('place', {
  place_name: Sequelize.STRING,
  place_type: Sequelize.STRING,
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
    venue_name: Sequelize.STRING,
    address_line: Sequelize.STRING,
    capacity: Sequelize.INTEGER,
    artist1: Sequelize.STRING,
    artist2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    artist3: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    genre: Sequelize.STRING,
    cost: Sequelize.DECIMAL,
    event_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // username:
    //how can I make this refer to other table
});

var Post = connection.define('post', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'app-users',
      key: 'id'
    } //end of references: FOREIGN KEY to toher table
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    references: {
      model: 'app-users',
      key: 'username'
    } //end of references: FOREIGN KEY to toher table
  },
  // post_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },
  post: {
    type: Sequelize.STRING,
    allowNull: false,
  }

});

// User.findOne().then(function (user) {
//     console.log(user.name);
// });


//Creating db connection object to export to main
var db = {
  User: User_test,
  Places: Place,
  Events: Event,
  Posts: Post,
  connection: connection
}; //end of db object

module.exports = db;
