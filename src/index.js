const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');

//init
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(multer({dest: path.join(__dirname, '/public/img/temp')}).single('image'));

//Global
app.use((req, res, next) => {
    app.locals.msg_success = req.flash('msg_success');
    app.locals.msg_error = req.flash('msg_error');
    app.locals.error = req.flash('error');
    app.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/contacts'));

//Statics
app.use(express.static(path.join(__dirname, 'public')));

//Server init
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});