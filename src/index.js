const express = require('express');
const path = require('path');
const expHbs = require('express-handlebars');
const methOverride = require('method-override');
const expSession = require('express-session');

const flash = require('connect-flash');
const passport = require('passport');

//Inicialización

const app = express();

require('./dataBase');
require('./config/passport');

//config

app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expHbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs')


//middlewares
app.use(express.urlencoded({extended: false}));
app.use(methOverride('_method'));
app.use(expSession({
    secret: 'secretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//variables globales
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user= req.user || null;


    next();
})

//Rutas
app.use(require('./routes/indexRouter'));
app.use(require('./routes/notas'));
app.use(require('./routes/users'));

//archivos estaticos
app.use(express.static(path.join(__dirname,'public')));

//Inicializacion del server

app.listen(app.get('port'), () =>{
    console.log('Servidor en el puerto ', app.get('port'));
});
module.exports = app;
