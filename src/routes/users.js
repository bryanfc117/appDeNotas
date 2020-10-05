const passport = require('passport');

const router = require('express').Router();

const User = require('../models/Users');

router.get('/users/ingreso', (req, res) => {
    res.render('users/ingreso');
});

router.post('/users/ingreso', passport.authenticate('local', {
    successRedirect: '/notas',
    failureRedirect: '/users/ingreso',
    failureFlash: true

}));



router.get('/users/registro', (req, res) => {
    res.render('users/registro');
});

router.post('/users/registro', async (req, res) =>{
    const {nombre, email, contrasena, confirm_contrasena} = req.body;
    const errors = [];
    if(nombre.length <=0 ){
        errors.push({text: 'Inserte su nombre'});
    }
    if(contrasena.length <=0 ){
        errors.push({text: 'Inserte la contraseña'});
    }
    if(contrasena != confirm_contrasena){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(contrasena.length < 6){
        errors.push({text: 'La contraseña debe tener al menos 6 caracteres'});
    }
    
    if(errors.length > 0){
        res.render('users/registro', {errors, nombre, email, contrasena, confirm_contrasena});
    }else{
        const emailUser = await User.findOne({email: email}); //verificar si el email ya fue registrado
        if(emailUser){
            req.flash('error_msg', 'El email ya esta en uso');
            
            res.redirect('/users/registro');
            

        }else{
            const nuevoUser = new User({nombre, email, contrasena}) ;
        nuevoUser.contrasena = await nuevoUser.encryptContrasena(contrasena);
        await nuevoUser.save();
        req.flash('success_msg', 'Estas registrado'); 
        console.log(nuevoUser);
        res.redirect('/users/ingreso');
        }
        
    }
});


router.get('/users/cerrar', (req, res) =>{
    req.logout();
    res.redirect('/');
});
module.exports = router;