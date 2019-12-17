
const express = require('express');
const cookieParser = require('cookie-parser');
let jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
let middleware = require('./middleware');
const cors = require('cors');


let app = express();
const port = process.env.PORT || 8003;

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
app.get('/', middleware.checkToken);


app.listen(port, () => console.log(`Server is listening on port: ${port}`));
