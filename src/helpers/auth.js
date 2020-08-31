const helper = {};

helper.isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/');
};

helper.isNotLogged = () => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/contacts');
};

module.exports = helper;