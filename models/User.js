const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const saltRounds = 10;

const userScheme = mongoose.Schema({
    name: {
        type: String,
        maxlenght: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlenght: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

userScheme.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrpyt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrpyt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next();
    }

})

userScheme.methods.comparePassword = function (plainPassword, cb){

    bcrpyt.compare(plainPassword, this.password, function (err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch);
    })
}

const User = mongoose.model('User', userScheme);

module.exports = { User };