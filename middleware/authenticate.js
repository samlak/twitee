const {User} = require('../models/User');

const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;

    if(req.url == '/login' || req.url == '/register'){
        if(token){
            res.redirect('/');
        }else{
            return next();
        }
    }

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        
        res.locals.authenticatedUser =  user;
        next();
    }).catch((e) => { 
        req.flash('authenticated', "Oops! You need to login to access this page");
        res.redirect('/login');
    });

};

module.exports = {authenticate}