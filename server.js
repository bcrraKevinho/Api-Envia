const express = require('express');

const app = express();
app.set("view engine", "ejs");

const userRoute = require('./routes/Envia');
app.use('/', userRoute);

app.use(express.urlencoded({ extended: false }));
 


app.listen(3000);
console.log('Server running at port 3000');