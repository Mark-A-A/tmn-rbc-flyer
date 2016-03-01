console.log("PORT: "+ process.env.PORT);
var PORT = process.env.PORT || 4040;
console.log(PORT); //checking for local port

var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
global.db = require('./config/connection.js')
var router = require('./controller/controller.js');

var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Directory for serving public static files
app.use(express.static('public'));

//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(methodOverride('_method'));


// app.get("/", function (req, res){
//   console.log(" on server.js: you hit home page")
//   res.render("home");
// });

app.use("/", router);
// app.use("/register", router);
// app.use("/login", router);
// app.use("/dashboard", router);


db.connection.sync(/*{force: true}*/).then(function () {
  app.listen(PORT, function (){
  debugger
  console.log("Server listening on Port %s", PORT);
  });
});
