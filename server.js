const express = require('express');

const app = express();
app.set("view engine", "ejs");

const userRoute = require('./routes/Envia');
app.use('/', userRoute);

app.get('/', function(req, res) { 
  res.render('index', {
  });
});

app.use(express.urlencoded({ extended: false }));
 


app.listen(3000);
console.log('Server running at port 3000');