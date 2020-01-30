const express = require('express');
const bodyParser = require('body-parser')
const os = require('os');
const mysql = require('mysql')
const util = require('util')
const bcrypt = require('bcrypt');
const salt = 10;

const jwt = require('jsonwebtoken')

const passport = require('passport')
const passportJWT = require('passport-jwt')

const app = express();

async function getUserById(id) {
    const rows = await connection.query('SELECT email FROM User WHERE id = ?', [id]);
    console.log(rows);
    return rows[0];
}

async function getUserByEmail(email) {
    const rows = await connection.query('SELECT id, password FROM User WHERE email = ?', [email]);
    console.log(rows);
    return rows[0];
}

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUserById(jwt_payload.id);

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
    
});

passport.use(strategy);

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'L712T0la.',
    database: 'project'
  })
connection.query = util.promisify(connection.query).bind(connection);

connection.connect()

app.use(express.static('dist'));
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.post('/api/login', async function (req, res, next) {
    const {email, password} = req.body;
    if (email && password) {
        let user = await getUserByEmail(email);
        console.log(user);
        if (!user) {
            res.status(401).json({message: 'No such user'});
        }
        let hash = bcrypt.hashSync(password, salt);
        console.log(hash);
        console.log(user.password);
        if (bcrypt.compareSync(password, user.password)) {
            let payload = {id: user.id};
            let token = jwt.sign(payload, jwtOptions.secretOrKey);
            res.json({ msg: 'ok', token: token });
        }3
    } else {
        res.status(401).json({message: 'Need email and password'});
    }
});

app.get('/api/protected', passport.authenticate('jwt', { session: false}), function (req, res) {
    res.json("Success!");
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
