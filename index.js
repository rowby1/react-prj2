const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true
    }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => { res.send('Hello world test') });

app.post('/register', (req, res) => {

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    });
});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "젝ㅇ된 이메일에 해당하는 유저가 없습니다."
            })
        } else {
            // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

                // 비밀번호까지 맞다면 토큰 생성하기
                user.generateToken((err, user) => {
                    if(err) return res.status(400).send(err);

                    //  토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지
                    res.cookie('x_auth', user.token)
                    .status(200)
                    .json({loginSuccess: true, userId : user._id})
                })
            })
        }
    })
})

// role 1 어드민 role 2 특정 부서 어드민
// role 0 -> 일반유저
app.post('/api/users/auth', auth, (req, res) => {

    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.rolem,
        image: req.user.image
    })
    
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, 
        {token: ""}
        , (err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`));