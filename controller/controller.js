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
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (username) {
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

//--------------ROUTES----------------------
router.get('/', function (req, res) {
  console.log("Controller: hitting  home page");
  res.render("home")
}); //end of home route

//Registration Page
router.get('/register', function (req, res){
  console.log("Controller.js: hitting register page");
  res.render('register');
});

//Event Registration
router.get('/event-registration', function (req, res){
  res.render('event-registration');
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
    res.send("you created a user..check db and table");
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
});

//Log In
router.get('/login', function (req, res) {
  console.log("Controller: hitting  login page");
  res.render("login");
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/dashboard',
  failureRedirect: '/?msg=Login Credentials do not work'
}));

//check login with db
//router.post('/check', passport.authenticate('local', {
// }));

router.get('/dashboard', function (req, res) {
  debugger
  //res.redirect("/login");

  var dbUsersEventsAndPostsData = {};
  console.log("hitting Social's dashboard page");
  console.log("req: "+ req);
  console.log("res: "+ res);
  
  db.User.findAll().then(function (results) {
     // where: {event_name: event_name}
    debugger
    console.log("looking to add Events to dashboard page");
    eventsTableData = {
         user: results
    };
    console.log("eventsTableData: "+ eventsTableData);
    dbUsersEventsAndPostsData.events = results;
    //res.render('dashboard', eventsTableData);
  });

  db.Events.findAll().then(function (results) {
     // where: {event_name: event_name}
    debugger
    console.log("looking to add Events to dashboard page");
    eventsTableData = {
         events: results
    };
    console.log("eventsTableData: "+ eventsTableData);
    dbEventsAndPostsData.events = results;
    //res.render('dashboard', eventsTableData);
  });
  db.Posts.findAll().then(function (results) {
    debugger
     // where: {event_name: event_name}
    var eventsPostData = {
         events: results
    }
    dbEventsAndPostsData.posts = results;
    console.log("eventsPostData: "+ eventsPostData);
  // res.render('dashboard', eventsTableData);

    console.log("dbEventsAndPostsData:"+ dbEventsAndPostsData);
    res.render('dashboard', dbEventsAndPostsData);

  });
//   var dbEventsAndPostsData = {
//     events: eventTableData,
//     posts: eventsPostData
//   }
  debugger
  console.log("dbEventsAndPostsData"+dbEventsAndPostsData);
  console.log("dbEventsAndPostsData.events"+dbEventsAndPostsData.events);
  console.log("dbEventsAndPostsData.posts"+dbEventsAndPostsData.posts);
  
  //res.render('dashboard', dbEventsAndPostsData);
});


router.post('/create-post', function (req, res) {
  debugger
  console.log(req.body);
  db.Posts.create({

  }).then(function (result) {
    console.log("successful post")
    res.redirect('/dashboard/?msg='+'posted to wall');
  }).catch(function (err){
    console.log(err);
    res.redirect('/dashboard/?msg='+'failed to post to wall');
  })

});

router.post('/dashboard/:post_id', function (req, res) {
  debugger

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
