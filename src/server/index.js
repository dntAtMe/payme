const express = require('express');
const bodyParser = require('body-parser')
const os = require('os');
const mysql = require('mysql')
const util = require('util')
const bcrypt = require('bcrypt');
const salt = 10;
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const { exec } = require('child_process');

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

async function getAllAccounts(id) {
    const rows = await connection.query('SELECT number FROM Account WHERE number != ? ', [id]);
    console.log(rows);
    return rows;
}

async function getAccountPayments(id) {
    const rows = await connection.query("SELECT DISTINCT Payment.id AS id, account_from, account_to, Payment.amount AS amount, date, Payment.status AS status, title FROM Payment INNER JOIN Account ON account_from = ? ORDER BY date DESC", [id]);
    console.log(rows);
    return rows;
}

async function getAccountPaymentsF(id, filter) {
    let s1 = '%'.concat(filter);
    let s2 = s1.concat('%');
    const rows = await connection.query("SELECT DISTINCT Payment.id AS id, account_from, account_to, Payment.amount AS amount, date, Payment.status AS status, title FROM Payment INNER JOIN Account ON account_from = ? WHERE (SELECT number FROM Account WHERE Account.id = account_to) LIKE ? ORDER BY date DESC", [id, s2]);
    console.log(rows);
    return rows;
}

async function getAccountIncomes(id) {
    const rows = await connection.query("SELECT DISTINCT Payment.id AS id, account_from, account_to, Payment.amount AS amount, date, Payment.status AS status, title FROM Payment INNER JOIN Account ON account_to = ? ORDER BY date DESC", [id]);
    console.log(rows);
    return rows;
}

async function getAccountIncomesF(id) {
    let s1 = '%'.concat(filter);
    let s2 = s1.concat('%');
    const rows = await connection.query("SELECT DISTINCT Payment.id AS id, account_from, account_to, Payment.amount AS amount, date, Payment.status AS status, title FROM Payment INNER JOIN Account ON account_to = ? WHERE (SELECT number FROM Account WHERE Account.id = account_from) LIKE ? ORDER BY date DESC", [id, s2]);
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
    console.log("DSASADSADSADSADSDSADSA")
    console.log(source)
    console.log(target)
    console.log(amount)
    console.log(title)

    const rows = await connection.query('CALL makePayment(?, ?, ?, ?)', [source, target, amount, title]);
    console.log(rows);
    return rows;
}

async function makePayment(source, amount, title, array) {
    const rows = await connection.query('CALL pay(?, ?, ?, ?)', [source, amount, title, array]);
    console.log(rows);
    return rows;
}

async function chargebackPayment(source, payment) {
    const rows = await connection.query('CALL chargebackPayment(?, ?)', [payment, source]);
    console.log(rows);
    return rows;
}

async function backupDatabase() {
    exec(`MYSQL_PWD=password mysqldump -u${exportFrom.user}  -h${exportFrom.host} --databases ${exportFrom.database} > ${dumpFile}`, (err, stdout, stderr) => {
	    if (err) { console.error(`exec error: ${err}`); return 0; }
    });
    return 1;
}

async function loadDatabase() {
    exec(`MYSQL_PWD=password mysql -u${importTo.user} -h${importTo.host} ${importTo.database} < ${dumpFile}`, (err, stdout, stderr) => {
        if (err) { console.error(`exec error: ${err}`); return 0; }
});
    return 1;
}


         

async function isAdmin(id) {
    const rows = await connection.query('SELECT COUNT(*) as count FROM User u INNER JOIN Users_Roles ur ON u.id = ur.user_id INNER JOIN Role r ON ur.role_id = r.id WHERE u.id = ? AND r.name = "admin"', [id]);
    console.log("ROWS " + rows);
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

let connection1 = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'project'
  })

  let connection2 = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'password',
    database: 'project'
  })

let dumpFile = '/tmp/dump.sql';	

let exportFrom = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "project"
}
let importTo = {
	host: "localhost",
	user: "root",
	password: "password",
	database: "backup_project"
}

connection2.query = util.promisify(connection2.query).bind(connection2);

connection2.connect()

connection1.query = util.promisify(connection1.query).bind(connection1);

connection1.connect()

let connection = connection1;

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
            let ret = await isAdmin(user.id);
            if (ret[0].count)
            {
                connection = connection2;
            }
            res.json({ msg: 'ok', token: token });
        } 
        else
        {
            res.status(401).json({message: 'Wrong email or password'});
        }
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
    console.log(rows[0]);
    res.json(rows);
});

app.post('/api/payment', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const {source, amount, title, array} = req.body;
    let user = await req.user;
    const validation = await validateUserAccountNum(user.id, source);
    console.log(validation.count)
    console.log(source)
    console.log(user)
    if (validation.count)
    {
        const ret = await makePayment(source, amount, title, array);
        console.log(ret);
        res.json(ret);    
    }
    else
    {
        res.status(401).json({message: 'Error'});
    }
});


app.get('/api/savebackup', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;
    const validation = await isAdmin(user.id);
    console.log(validation[0].count)
    
    if (validation[0].count)
    {
        const ret = await backupDatabase();
        console.log(ret);
        res.json({message: 'ok'});    
    }
    else
    {
        res.status(401).json({message: 'Error'});
    }
});

app.get('/api/loadbackup', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;
    const validation = await isAdmin(user.id);
    console.log(validation[0].count)
    
    if (validation[0].count)
    {
        const ret = await loadDatabase();
        console.log(ret);
        res.json({message: 'ok'});    
    }
    else
    {
        res.status(401).json({message: 'Error'});
    }
});

app.post('/api/chargeback', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const {source, payment} = req.body;
    let user = await req.user;
    const validation = await validateUserAccount(user.id, source);
    console.log(validation.count)
    console.log(source)
    console.log(user)
    if (validation.count)
    {
        const ret = await chargebackPayment(source, payment);
        console.log(ret);
        res.json({message: 'ok'});    
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

app.post('/api/payments', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccount(user.id, account);
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

app.post('/api/paymentsf', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account, filter } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccount(user.id, account);
    console.log(validation.count)
    if (validation.count)
    {
        const rows = await getAccountPaymentsF(account, filter);
        console.log(rows[0]);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Not your account'});
    }
});

app.post('/api/incomesf', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account, filter } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccount(user.id, account);
    console.log(validation.count)
    if (validation.count)
    {
        const rows = await getAccountIncomesF(account, filter);
        console.log(rows[0]);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Not your account'});
    }
});

app.post('/api/incomes', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccount(user.id, account);
    console.log(validation.count)
    if (validation.count)
    {
        const rows = await getAccountIncomes(account);
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

app.get('/api/privileges', passport.authenticate('jwt', { session: false}), async function (req, res) {
    let user = await req.user;
    const rows = await isAdmin(user.id);
    console.log("TEST" + rows[0].count);
    res.json(rows);
});


app.post('/api/allaccounts', passport.authenticate('jwt', { session: false}), async function (req, res) {
    const { account } = req.body;
    let user = await req.user;
    console.log('account: ' + account);
    const validation = await validateUserAccountNum(user.id, account);
    console.log(validation.count)
    if (validation.count)
    {
        const rows = await getAllAccounts(account);
        console.log(rows[0]);
        res.json(rows);    
    }
    else
    {
        res.status(401).json({message: 'Not your account'});
    }
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
