const mongoose = require('mongoose');
const bcrpyt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        type: String
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

userScheme.methods.generateToken = function(cb){

    var user = this;
    //jsonwebtoek을 이용해서 token 생성

    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    // user._id + 'sercretToken' = token -> 'secretToken' -> user._id
    user.token = token
    user.save(function (err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userScheme.statics.findByToken = function (token, cb){
    var user = this;

    // user.id + '' = token
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decode){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관딘 토큰이 일치하는지 확인

        user.findOne({"_id":decode, "token": token}, function(err, user){
            if (err) return cb(err);
            cb(null, user);
        })

    })
};

const User = mongoose.model('User', userScheme);

module.exports = { User };