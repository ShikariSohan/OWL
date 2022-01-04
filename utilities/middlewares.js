const jwt = require('jsonwebtoken');
const User = require('../models/user');
module.exports.isLoggedin = async(req,res,next)=>{

    let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    try{
      const token = cookies[process.env.cookieUserName];
      const decoded = jwt.verify(token, process.env.jwtString);
      req.user = await User.findOne({_id: decoded._id});
      res.locals.currentUser=req.user;
    }
  catch(err)
  {
    req.flash('error','Please Log in first')
    return res.redirect('/login')
  }
   next();
}