const User = require('../models/index').User
const hashingPassword = require('../helpers/hashingPassord')
const Tag = require('../models').Tag

class UserController {
    static registerPage(req, res){
        res.render('users/register', {})
    }

    static register(req, res){
        let {first_name, last_name, password, email, username} = req.body
        
        User.create({
            first_name: first_name,
            last_name: last_name,
            password: password,
            email: email,
            username: username
        })
        .then(()=> {
            res.redirect('/user')
        })
        .catch(err => {
            res.send(err)
        })
    }

    static loginPage(req, res){
        const data = req.query;
        res.render('users/login', {data});
    }

    static login(req, res){
        let {password, username} = req.body
        const options ={
            where: {
                username: username
            }
        }
        User.findOne(options)
        .then(user => {
            if (!user || !user['secret']) {
                throw 'Wrong Username or Password';
            } else {
                let checkPassword = hashingPassword(user['secret'], password)
                if (user['password'] !== checkPassword) {
                    throw 'Wrong Username or Password';
                }else{
                    req.session.userId = user['id']
                    req.session.fullName = `${user['first_name']} ${user['last_name']}`;
                    res.redirect(`/user/page`);
                }
            }
        })
        .catch((err) => {
            res.redirect(`/user?failed=${err}`);
        })
    }

    static editPage(req, res){
        const userId = req.session.userId;
        const fullName = req.session.fullName
        const data = req.query || null;
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(user=> {
            if (!user.profilPict) {
                user.setDataValue('profilPict','161bbd1abc24d29e1abefd0f21ff90f8');
            }
            res.render('users/edit', {user, data, fullName})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static edit(req,res){
        let {first_name, last_name, old_password, new_password, email, username} = req.body
        let userId = req.session.userId
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(user => {
            let checkPassword = hashingPassword(user['secret'], old_password)
            if(user['password'] !== checkPassword) {
                res.redirect('/user/edit?failed=Wrong Password');
            } else {
                let values = {
                    first_name: first_name,
                    last_name:last_name,
                    password: null,
                    email: email,
                    username: username
                };
                let options = {
                    where: {
                        id: userId
                    }
                };
                
                if (!new_password) {
                    values.password = hashingPassword(user['secret'], old_password)
                } else {
                    values.password = hashingPassword(user['secret'], new_password)
                }
                return User.update(values, options)
            }
        })
        .then((data) => {
            res.redirect('/user/edit?success=Data successfully changed');
        })
        .catch(err => {
            res.send(err);
        })
    }

    static userPage(req, res){
        let userId = req.session.userId
        let fullName = req.session.fullName
        let user = null
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(userLogin => {
            if (!userLogin.profilPict) {
                userLogin.setDataValue('profilPict','161bbd1abc24d29e1abefd0f21ff90f8');
            }
            user = userLogin
            let options = {
                include: Tag,
                order: [['createdAt','DESC']]
            }
            return user.getFeeds(options)
        })
        .then(feed => {
            res.render('users/user', {feed, user, fullName})
        })
        .catch(err => {
            res.send(err)
        })
    }
    
    static uploadImage(req, res) {
        if (!req.file) {
            res.redirect('/user/edit?failed=Invalid image file');
        }

        const values = {
            profilPict: req.file.filename
        };
        const options = {
            where: {
                id: req.session.userId
            }
        };

        User.update(values, options)
            .then((result) => {
                res.redirect('/user/edit?success=Profile picture successfully changed');
            }).catch((err) => {
                res.send(err);
            });
    }

    static otherPage(req, res){
        let userId = req.params.id
        let fullName = req.session.fullName
        let user = null
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(userLogin => {
            if (!userLogin.profilPict) {
                userLogin.setDataValue('profilPict','161bbd1abc24d29e1abefd0f21ff90f8');
            }
            user = userLogin
            let options = {
                include: Tag,
                order: [['createdAt','DESC']]
            }
            return user.getFeeds(options)
        })
        .then(feed => {
            res.render('users/otherPage', {feed, user, fullName})
        })
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = UserController

