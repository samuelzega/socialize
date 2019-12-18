const express = require('express')
const app = express();
const port = 3000;
const {home, feed, tag, user} = require('./routes');
const fs = require("fs");
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', home);
app.use('/feeds', feed);
app.use('/tags', tag);
app.use('/user', user);

// parse application/json
app.use(bodyParser.json())
app.post('/upload', (req, res) => {
    const data = {
        body: req.body,
        params: req.params,
        query: req.query
    };
    res.send(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));