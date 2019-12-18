const User = require('../models/index').User
const hashingPassword = require('../helpers/hashingPassord')

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
        res.render('users/login', req.params)
    }

    static login(req, res){
        let {password, username} = req.body
        
        User.findOne({
            where: {
                username: username
            }
        })
        .then(user => {
            if (!user || !user['secret']) {
                throw 'Wrong Username or Password';
            } else {
                let checkPassword = hashingPassword(user['secret'], password)
                if (user['password'] !== checkPassword) {
                    throw 'Wrong Username or Password';
                }else{
                    res.redirect(`/user/${user['id']}`);
                }
            }
        })
        .catch((err) => {
            res.redirect(`/user?failed=${err}`);
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
    
}

module.exports = UserController

