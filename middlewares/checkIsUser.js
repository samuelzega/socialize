module.exports = (req, res, next) =>{
    if (req.session.userId == req.params.id) {
        res.redirect('/user/page')
    }
    else{
        next()
    }
}
