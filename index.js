const express = require('express');
const app = express();
var http = require('http').Server(app);

app.set('view engine', 'ejs');
app.set('view options', {
    pretty: true
});


app.use(express.static(__dirname + '/views'));

app.get('/', async function(req, res) {
    res.render('pages/index');
});

app.get('/webtracker', async function(req, res) {
    res.render('pages/webtracker');
});

http.listen(4040, () => console.log(`App listening on port 4040!`));