const express = require('express');
const bodyParser = require('body-parser')
const os = require('os');
const mysql = require('mysql')
const util = require('util')
const bcrypt = require('bcrypt');
const salt = 10;
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')

const jwt = require('jsonwebtoken')

const passport = require('passport')
const passportJWT = require('passport-jwt')

const app = express();

async function getUserById(id) {
    const rows = await connection.query('SELECT id FROM User WHERE id = ?', [id]);
    return rows[0];
}

async function getUserByEmail(email) {
    const rows = await connection.query('SELECT id, password FROM User WHERE email = ?', [email]);
    console.log(rows);
    return rows[0];
}

async function createUser(email, password) {
    const rows = await connection.query('CALL createUser(?, ?)', [email, password]);
    console.log(rows);
    return rows;
}

async function getAllAccountsByClient(id) {
    const rows = await connection.query('SELECT * FROM Account WHERE client_id = (SELECT id FROM Client WHERE user_id = ?)', [id]);
    console.log(rows);
    return rows;
}

async function getAccountPayments(id) {
    const rows = await connection.query("SELECT account_from, account_to, Payment.amount AS amount, date, Payment.status AS status, title FROM Payment INNER JOIN Account ON account_from = ? OR account_to = ? ORDER BY date DESC", [id, id]);
    console.log(rows);
    return rows;
}
async function getUserInfo(id) {
    const rows = await connection.query("SELECT email, creation_date, Role.name FROM User INNER JOIN Users_Roles ON User.id = user_id INNER JOIN Role ON role_id = Role.id WHERE User.id = ? ORDER BY Role.id DESC", [id]);
    console.log(rows[0]);
    return rows[0];
}

async function validateUserAccount(userID, accountID) {
    const rows = await connection.query("SELECT COUNT(*) AS count FROM Account a INNER JOIN Client c on a.client_id = c.id WHERE c.user_id = ? AND a.id = ?", [userID, accountID]);
    console.log(rows[0]);
    return rows[0];
}

async function validateUserAccountNum(userID, accountNum) {
    const rows = await connection.query("SELECT COUNT(*) AS count FROM Account a INNER JOIN Client c on a.client_id = c.id WHERE c.user_id = ? AND a.number = ?", [userID, accountNum]);
    console.log(rows[0]);
    return rows[0];
}

async function makePayment(source, target, amount, title) {
    const rows = await connection.query('CALL makePayment(?, ?, ?, ?)', [source, target, -1, title]);
    console.log(rows);
    return rows;
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

app.use(cookieParser());
app.use(bodyParser());
app.use(passport.initialize());   
app.use(passport.session());
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

app.post('/api/register', async function (req, res, next) {
    const {email, password} = req.body;
    if (email && password) {
        const hash = bcrypt.hashSync(password, salt);
        let ret;
        try {
            ret = await createUser(email, hash);
        } catch {
            ret = -1;
        }
        console.log(ret);
        if (ret == -1){
            res.status(401).json({message: 'Failed to create'});
        }
        res.json({msg: 'ok'});
    } else {
        res.status(401).json({message: 'Need email and password'});
    }
});

app.get('/api/protected', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let uid = await req.user
    console.log();
    res.json("Success!");
});

app.get('/api/accounts', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;
    console.log(user.id);

    const rows = await getAllAccountsByClient(user.id);
    console.log("DUPA");
    console.log(rows[0]);
    res.json(rows);
});

app.post('/api/payment', async function (req, res, next) {
    const {user, source, target, amount, title} = req.body;
    const validation = await validateUserAccountNum(user, source);
    console.log(validation.count)
    if (validation.count)
    {
        const ret = await makePayment(source, target, amount, title);
        console.log(ret);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Error'});
    }
});

app.post('/api/transaction', async function (req, res, next) {
    const {user, source, targets} = req.body;
    const validation = await validateUserAccountNum(user, source);
    console.log(validation.count)
    if (validation.count)
    {
        const ret = await makeTransaction(source, targets, amount, title);
        console.log(ret);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Error'});
    }
});

app.get('/api/payments', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccountNum(user.id, account);
    console.log(validation.count)
    if (validation.count)
    {
        const rows = await getAccountPayments(account);
        console.log(rows[0]);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Not your account'});
    }
});

app.get('/api/user', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;

    const rows = await getUserInfo(user.id);
    console.log(rows[0]);
    res.json(rows);
});

app.get('/api/accounts', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;
    console.log(user.id);

    const rows = await getAllAccountsByClient(user.id);
    console.log(rows[0]);
    res.json(rows);
});


app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
