module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.flash('error','Please Log in First');
        return res.redirect('/login');
    }
    next();
}
