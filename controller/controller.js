var express = require('express');
var router = express.Router();
// var flyerMethods = require('../model/flyer.js')
var app = express();
var passport = require('passport');

// app.use(require('serve-static')(__dirname + '/../../public'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());


router.get('/', function (req, res) {
  console.log("Cpntroller: hitting  home page");

  db.User.findAll({}).then(function (dbUsers) {
    var rutgersUsers = dbUsers;
    console.log(dbUsers);
    
    console.log("getting data back..Your Data:"+ rutgersUsers);
    
    res.send(dbUsers);
  });
}); //end of home route

  
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




router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });



router.get('/dashboard', function (req, res) {
  debugger
  console.log("hitting  home page")
  
  flyerMethods.allData(function (rutgersData) {
    debugger
    console.log("rutgersData from ORM: " + rutgersData);
    //Data Object for handlebars
    // var rutgersTableData = {
    //     rutgersDashboard: rutgersData
    // }

    console.log("rutgersTableData");
    //res.redirect("/");
    //res.render('home', rutgersTableData);
    res.send("You are on the dashboard page");
  });
});

router.get('/register', function (req, res){
  console.log("hi");
  res.render('register');
});
module.exports = router;
