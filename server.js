const express = require('express');
var bodyParser = require('body-parser')

const app = express();
app.set("view engine", "ejs");

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const userRoute = require('./routes/Envia');
app.use('/', userRoute);


app.listen(3000);
console.log('Server running at port 3000');