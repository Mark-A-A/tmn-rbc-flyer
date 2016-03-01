var express = require('express');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var PORT = 3000;
var session = require('express-session');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var passportLocal = require('passport-local');

//handlebars setup
var app = express();

//body parsing middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

//pointing to main default layout (main.handlebars)
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//middleware init
app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });

}));

//change the object used to authenticate to a smaller token, and protects the server from attacks
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    done(null, { id: id, name: id })
});

// database setup
var connection = new Sequelize('test_flyer_db2', 'root', 'atom828ye567');

//models
var User = connection.define('user', {
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
  user_type: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: function(input){
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
    cost: Sequelize.DECIMAL,
    // username: 
    //how can I make this refer to other table
});

app.get("/", function (req, res){
  console.log("hit home page")
  res.render("home");
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post("/register-info", function(req, res){
  User.create(req.body).then(function(result){
    res.redirect('/');
  }).catch(function(err) {
    console.log(err);
    res.redirect('/?msg=' + err.errors[0].message);
  });
})

connection.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening on port %s", PORT);
  });
});