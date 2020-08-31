const express = require('express');
const router = express.Router();

const User = require('../model/Users');
const passport = require('passport');

router.get('/users/login', (req, res) => {
    res.render('users/login');
});

router.post('/users/login', passport.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/users/login',
    failureFlash: true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, lastname, email, password, repassword } = req.body;
    const errors = [];

    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener mas de 4 caracteres' });
    }

    if (password != repassword) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }

    const check = await User.findOne({ email: email });
    if (check) {
        errors.push({text: 'El email ya existe'});
    }

    if (errors.length > 0) {
        res.render('users/signup', { errors, name, lastname, email, password, repassword });
    } else {
        const newUser = new User({ name, lastname, email, password });
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('msg_success', 'Usuario registrado con éxito');
        res.redirect('/users/login');

    }
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('users/login');
})

module.exports = router;