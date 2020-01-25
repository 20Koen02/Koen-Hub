const c = require('chalk');
const { log } = require('./log')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const middleware = require('./middleware');
const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const socketioJwt = require('socketio-jwt');
const port = 8003;
require('dotenv').config()

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.set('trust proxy', true)

app.post('/login', middleware.generateToken);
app.get('/login', function (req, res) {
    res.render('pages/login')
})
app.get('/', middleware.checkToken, function (req, res) {
    res.render('pages/index')
});
app.get('/agenda', middleware.checkToken, function (req, res) {
    res.render('pages/agenda')
});
app.get('/school', middleware.checkToken, function (req, res) {
    res.render('pages/school')
});

io.on('connection', socketioJwt.authorize({
    secret: process.env.SECR,
    timeout: 15000
}));
io.on('authenticated', function (socket) {
    log(c.magenta(socket.decoded_token.username) + " authenticated to a socket");
});



server.listen(port, () => log(`Server is listening on port: ${c.magenta(port)}`));
