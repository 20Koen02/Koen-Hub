const c = require('chalk');
const { log } = require('./log')
let jwt = require('jsonwebtoken');
require('dotenv').config()
const argon2 = require('argon2');
const iplocation = require("iplocation").default;
const { getName } = require('country-list');


async function checkPassword(password, hash) {
    try {
        return await argon2.verify(hash, password)
    } catch {
        return false
    }
}

function getLocation(req, succ = false) {
    iplocation(req.ip)
        .then((res) => {
            if (!res.region) throw "";
            log(c.magenta(req.ip) + " " + ((succ) ? c.green("succesfully") : c.red("unsuccessfully")) + " logged in from " + c.magenta(res.region) + ", " + c.magenta(res.countryCode))

        })
        .catch(err => {
            log(c.magenta(req.ip) + " " + ((succ) ? c.green("succesfully") : c.red("unsuccessfully")) + " logged in")
        });
}

let generateToken = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    if (!username || !password) {
        getLocation(req, false)
        return res.redirect('/login');
    }
    if (username != process.env.USRN) {
        getLocation(req, false)
        return res.redirect('/login');
    }

    checkPassword(password, process.env.HASH).then((result) => {
        if (result) {
            let token = jwt.sign({ username: process.env.USRN },
                process.env.SECR,
                {
                    expiresIn: '1d'
                }
            );
            res.cookie('token', token, {
                expires: new Date(Date.now() + 86400000)
            });

            getLocation(req, true)
            return res.redirect('/');
        } else {
            getLocation(req, false)
            return res.redirect('/login');
        }
    })
};

let checkToken = async (req, res, next) => {
    const token = req.cookies.token || '';
    if (!token) return res.redirect('/login');

    try {
        const decrypt = await jwt.verify(token, process.env.SECR)
        return next()
    } catch (e) {
        return res.redirect('/login');
    }
};

module.exports = {
    checkToken: checkToken,
    generateToken: generateToken
};