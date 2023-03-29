module.exports = (req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        next();
    } else {
        res.redirect('/gaia/login');    
    }
}; 