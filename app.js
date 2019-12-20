const express = require('express')
const app = express();
const port = 3000;
const session = require('express-session')
const {home, feed, tag, user} = require('./routes');

app.use(session({
    secret: 'sequelize samuel harfi'
}))

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/user', user);
app.use('/feeds', feed);
app.use('/tags', tag);
app.use('/', user);

app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/user');
      }
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));