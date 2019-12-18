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
        res.render('users/login', {})
    }

    static login(req, res){
        let {password, username} = req.body
        
        User.findOne({
            where: {
                username: username
            }
        })
        .then(user => {
            let checkPassword = hashingPassword(user['secret'], password)
            if (user['password'] === checkPassword) {
                console.log(`${user['first_name']} successed login`);
                res.redirect(`/user/${user['id']}`)
            }else{
                console.log('login failed');
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    static editPage(req, res){
        User.findOne({
            where:{
                id: req.params.id
            }
        })
        .then(user=> {
            res.render('users/edit', {user})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static edit(req,res){
        let {first_name, last_name, old_password, new_password, email, username} = req.body
        let userId = req.params.id
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(user => {
            let checkPassword = hashingPassword(user['secret'], old_password)
            if(user['password'] !== checkPassword) {
                console.log('pasword wrong');
            }else if(user['password'] === checkPassword){
                let newPassword = hashingPassword(user['secret'], new_password)
                return User.update({
                    first_name: first_name,
                    last_name:last_name,
                    password: newPassword,
                    email: email,
                    username: username
                }, {
                    where: {
                        id: userId
                    }
                })
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
    }

    static userPage(req, res){
        let userId = req.params.id
        let user = null
        User.findOne({
            where:{
                id: userId
            }
        })
        .then(userLogin => {
            // res.render('users/user', {user})
            user = userLogin
            return user.getFeeds({include : Tag})
        })
        .then(feed => {
            // res.send(feed[1]['Tags'][0]['name'])
            res.render('users/user', {feed, user})
        })
        .catch(err => {
            res.send(err)
        })
    }
    
}

module.exports = UserController

