const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../model/Users');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'El usuario no existe' });
    } else {
        const check = await user.comparePassword(password);

        if (check) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    }).lean();
    
});