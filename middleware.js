let jwt = require('jsonwebtoken');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.sqlite3', sqlite3.OPEN_READONLY);

const argon2 = require('argon2');


async function checkPassword(password, hash) {
    try {
        return await argon2.verify(hash, password)
    } catch {
        return false
    }
}

let generateToken = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.redirect('/login');
    }

    db.all(`SELECT * FROM passwords WHERE username=(?)`, username, function (err, rows) {
        if (rows.length == 0) {
            return res.redirect('/login');
        }
        checkPassword(password, rows[0]["hash"]).then((result) => {
            if (result) {
                db.all(`SELECT * FROM jwt`, async function(err, rows) {
                    let token = jwt.sign({ username: username },
                        rows[0]["key"],
                        {
                            expiresIn: '1d'
                        }
                    );
                    res.cookie('token', token, {
                        expires: new Date(Date.now() + 86400000)
                    });
                    return res.redirect('/');
                })
            } else {
                return res.redirect('/login');
            }
        })
    });
};

let checkToken = async (req, res) => {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.redirect('/login');
        }
        db.all(`SELECT * FROM jwt`, async function(err, rows) {
            try {
                const decrypt = await jwt.verify(token, rows[0]["key"])
                console.log(req.ip +"\tlogged in at\t" + Date(Date.now()).toString())
                return res.render('pages/index')
            } catch (e) {
                return res.redirect('/login');
            }
        })
    } catch (err) {
        res.redirect('/login');
    }
};

module.exports = {
    checkToken: checkToken,
    generateToken: generateToken
};