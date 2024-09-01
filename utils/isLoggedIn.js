const passport = require('../passport-auth/passport');// Import the passport module

function isLoggedin(req, res, next) {
    passport.authenticate('jwt', { session: false })(req, res, next);
}

module.exports=isLoggedin;
