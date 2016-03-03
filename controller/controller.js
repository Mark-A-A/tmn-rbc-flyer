global.db = require('../config/connection.js');

var express = require('express');

var router = express.Router();

var session = require('express-session')

var cookieParser = require('cookie-parser')

var bodyParser = require('body-parser');

var passport = require('passport');
var passportLocal = require('passport-local');

var bcrypt = require('bcryptjs');

var serveStatic = require('serve-static');

var app = express();

//initializing node packages for Middleware

app.use(serveStatic(__dirname + '/public'));

//Parse the body of responses
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware for Session
//Session ID
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
//For parsing cookie information - Ex: console.log("Cookies: ", req.cookies)
app.use(cookieParser());

//Starting Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(
  function (username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        //check password against hash
        if (user) {
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


router.get('/', function (req, res) {
  debugger
  console.log("Controller: hitting  home page");

  // db.User.findAll({}).then(function (dbUsers) {
  //   console.log(dbUsers);
    
  //   //Creating data objects for handlebars renderings
  //   var userTableData = {
  //     appUsers: dbUsers
  //   }
    
    
  //   console.log("getting data back..Your Data:"+ userTableData.appUsers);
    
  //   //res.send(dbUsers);
  //   

  // });
  res.render("home")
}); //end of home route

 

//Registration Page
router.get('/register', function (req, res){
  console.log("Controller.js: hitting register page");
  res.render('register');
});

router.post('/register', function (req, res) {
  debugger
  console.log(req.body);
  //Parse the body of the request from the form
  console.log(req.body.username);
  console.log(req.body.password);
  var userToRegister  = req.body.username;
  var userFirstName   = req.body.firstname;
  var userLastName    = req.body.lastname;
  var userLocation    = req.body.location;
  var userName        =req.body.username;
  var userEmail       = req.body.email;
  var userPW          = req.body.password;
  var userType        = req.body.user_type;
  //res.send(req.body);
  db.User.create({
    firstname: userFirstName,
    lastname: userLastName,
    location: userLocation,
    username: userName,
    email: userEmail,
    password: userPW,
    user_type: userType

  }).then(function (result) {
    debugger
    console.log("successful registration")
    //res.redirect('/success');
    res.send("you created a user..check db and table");
  }).catch(function (err){
    debugger
    console.log(err);
    res.redirect('/register/?msg='+'failed to register');
  });

});

//Log In
router.get('/login', function (req, res) {
  debugger
  console.log("Controller: hitting  login page");

  //db.User.findAll({}).then(function (dbUsers) {
  //console.log(dbUsers);
    
  //console.log("getting data back..Your Data:"+ userTableData.appUsers);
  //}); 

    //res.send(dbUsers);
    res.render("login");
  
})
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard/$msg='+ "successful login");
});



router.get('/dashboard', function (req, res) {
  debugger
  console.log("hitting Social's dashboard page")
  
  // flyerMethods.allData(function (rutgersData) {
  //   debugger
  //   console.log("rutgersData from ORM: " + rutgersData);
  //   //Data Object for handlebars
  //   // var rutgersTableData = {
  //   //     rutgersDashboard: rutgersData
  //   // }

  //   console.log("rutgersTableData");
  //   //res.redirect("/");
  //   //res.render('home', rutgersTableData);
  //   res.send("You are on the dashboard page");
  // });

  res.render('dashboard');
});


module.exports = router;





/*  Scrap Code
 
  // flyerMethods.allData(function (rutgersData) {
  //   debugger
  //   console.log("rutgersData from ORM: " + rutgersData);
  //   //Data Object for handlebars
    
  //   var rutgersTableData = {
  //     rutgersUsers: rutgersData
  //   };

  //   console.log("rutgers Data from Table: " + rutgersData);

  // //   //res.redirect("/");
  //   res.send(rutgersTableData);
  //   //res.render('home', );
  // //   res.send("You are on the home page");
  // // });
  //  //res.send("You are on the home page");
  // }); //end of DB callback

*/


