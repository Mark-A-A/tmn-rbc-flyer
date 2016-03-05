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
//using servestaic for static files
app.use(serveStatic(__dirname + '/public'));

//Parse the body of responses
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware for Session
//Session ID
router.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
//For parsing cookie information - Ex: console.log("Cookies: ", req.cookies)
router.use(cookieParser());

//Starting Passport Authentication
router.use(passport.initialize());
router.use(passport.session());

//passport use methed as callback when being authenticated
passport.use(new passportLocal.Strategy(
  function (username, password, done) {

    //check password in db
    db.User.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        //check password against hash
        if (user) {
            bcrypt.compare(password, user.dataValues.password, function(err, success) {
                if (success) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, false, {message: "Username and Password do not match"});
                }
            });
        } else {
            done(null, false, {message: "Username and Password do not match"});
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

//--------------ROUTES----------------------
router.get('/', function (req, res) {
  console.log("Controller: hitting  home page");
  res.render("home")
}); //end of home route

router.get('/home', function (req, res){
  res.render('home')
});


//Registration Page
router.get('/register', function (req, res){
  console.log("Controller.js: hitting register page");
  res.render('register');
});

//Login
router.get('/login', function (req, res) {
  console.log("Controller: hitting  login page");
  res.render("login");
});

//Event Registration
router.get('/event-registration', function (req, res){
  if(req.isAuthenticated()){
    res.render('event-registration');  
  }else{
    res.render('/home/?msg='+'not authenticated')
  }
});

router.get('/dashboard', function (req, res) {
  //res.redirect("/login");
  console.log("hitting Social's dashboard page");
  console.log("req: "+ req)
  console.log("res: "+ res)
  db.Events.findAll().then(function (results) {
     // where: {event_name: event_name}
     var eventsTableData = {
       events: results
     }
     console.log("eventsTableData: "+eventsTableData);

     if(req.isAuthenticated()){
       res.render('dashboard', eventsTableData);
     }else{
      res.redirect('/home/?msg='+'not authenticated')
    };
  });
});

// -------Adding information to databases----------
router.post('/register', function (req, res) {
  
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
    
    console.log("successful registration")
    //res.redirect('/success');
    res.redirect('/login');
  }).catch(function (err){
    
    console.log(err);
    res.redirect('/register/?msg='+'failed to register');
  });
});

router.post('/event-registration', function (req, res) {
    var event_name = req.body.event_name;
    var event_day = req.body.event_day;
    var event_date = req.body.event_date;
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var venue_name = req.body.venue_name;
    var address_line = req.body.address_line;
    var capacity = req.body.capacity;
    var artist1 = req.body.artist1;
    var artist2 = req.body.artist2;
    var artist3 = req.body.artist3;
    var genre = req.body.genre;
    var cost = req.body.cost;
    var event_url = req.body.event_url;

    db.Events.create({
      event_name: event_name,
      event_day: event_day,
      event_date: event_date,
      start_time: start_time,
      end_time: end_time,
      venue_name: venue_name,
      address_line: address_line,
      capacity: capacity,
      artist1: artist1,
      artist2: artist2,
      artist3: artist3,
      genre: genre,
      cost: cost,
      event_url: event_url
    }).then(function (result) {
    console.log("successful registration")
    res.redirect('/dashboard');
  }).catch(function (err){
    console.log(err);
    res.redirect('/register/?msg='+'failed to register event');
  }); 
})

router.post('/login', 
  passport.authenticate('local', { 
  successRedirect: '/dashboard',
  failureRedirect: '/?msg=Login Credentials do not work'
  // failureRedirect: '/login'
}));

router.post('/dashboard/posts:id', function (req, res) {

  console.log("req.body: " +req.body);

  console.log("id: "+ req.body.id);
  var idToDelete = req.body.id;
  db.Events.destroy({
    where: {
      id: idToDelete
    }
  });
  res.redirect('/dashboard');
});

module.exports = router;
