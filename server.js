const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('Hello world with express!'));

app.listen(3001);
console.log('Server running at http://localhost:3001/');