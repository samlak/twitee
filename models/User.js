const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true, 
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    date_created: {
        type: Date
    }
});

// Generate authentication token and save to database
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        return token;
    })
}

// Remove authentication token from the database
UserSchema.methods.removeToken = function(token){
    var user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
}

// Check if token is valid
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decode;
    try{
        decode = jwt.verify(token, process.env.JWT_SECRET)
    }catch(error){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

// Check user credentials when logging in
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(!res){
                    return reject();
                }
                resolve(user);
            });
        });
    });
};

// Generate password when creating acount
UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(8, (err,  salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
        
    }else{
        next();
    }
});


const User = mongoose.model('User', UserSchema);

module.exports = {User};