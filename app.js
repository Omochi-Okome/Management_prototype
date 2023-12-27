const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.listen(3000);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extends: false}));

app.use('/',(req,res) => {
    res.send('Hello World!');
});