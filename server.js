console.log("PORT: "+ process.env.PORT);

var PORT = process.env.PORT || 4040;
console.log(PORT); //checking for local port
var express = require('express');
var exphbs  = require('express-handlebars');

var bodyParser = require('body-parser');

var methodOverride = require('method-override')
var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));


//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get("/", function (req, res){
  console.log("hit home page")
  res.send("Hello World ")
});

app.listen(PORT, function (){
  console.log("Server listening on Port %s", PORT);
});