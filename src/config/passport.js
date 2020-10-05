const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'contrasena'
}, async (email, contrasena, done) =>{
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'Usuario o contraseña invalido'});
    }else{
        const match = await user.comparaContrasena(contrasena);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Usuario o contraseña invalido'});
        }
    }
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});