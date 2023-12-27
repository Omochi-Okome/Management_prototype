const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const mongoConnect = require('./util/database').mongoConnect;

require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use('/',homeRoutes);
app.use('/',adminRoutes);

mongoConnect(() => {
    app.listen(3000);
})