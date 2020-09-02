require('./config/config');
require('./config/db-connection');
const routes = require('./routes/index');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();

const port = process.env.PORT;

app.use(
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json({ limit: '50mb' }),
    cookieParser(),
    session({ 
        secret: process.env.JWT_SECRET,
        cookie: { 
            maxAge: 60000,
            expires: new Date(253402300000000)
        },
        resave: true,
        saveUninitialized: false
    }),
    flash(),
    express.static(path.join(__dirname, '/public'))
);

app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
});

module.exports = {app}