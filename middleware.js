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

let generateToken = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;


    if (!username || !password) {
        return res.redirect('/login');
    }
    if (username != process.env.USER) {
        return res.redirect('/login');
    }

    checkPassword(password, process.env.HASH).then((result) => {
        if (result) {
            let token = jwt.sign({ username: process.env.USER },
                process.env.SECR,
                {
                    expiresIn: '1d'
                }
            );
            res.cookie('token', token, {
                expires: new Date(Date.now() + 86400000)
            });
            return res.redirect('/');
        } else {
            return res.redirect('/login');
        }
    })
};

let checkToken = async (req, res) => {
    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.redirect('/login');
        }

        try {
            const decrypt = await jwt.verify(token, process.env.SECR)

            iplocation(req.ip)
                .then((res) => {
                    log(c.magenta(req.ip) + " logged in from " + c.magenta(res.region) + ", " + c.magenta(res.countryCode))

                })
                .catch(err => {
                    log(c.magenta(req.ip) + " logged in")
                });

            return res.render('pages/index')
        } catch (e) {
            return res.redirect('/login');
        }

    } catch (err) {
        res.redirect('/login');
    }
};



module.exports = {
    checkToken: checkToken,
    generateToken: generateToken
};