const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',homeRoutes);
app.use('/',adminRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
})