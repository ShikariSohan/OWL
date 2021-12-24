const jwt = require('jsonwebtoken');

module.exports.isLoggedin = (req,res,next)=>{

    let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    try{
      const token = cookies[process.env.cookieUserName];
      const decoded = jwt.verify(token, process.env.jwtString);
      req.user = decoded;
      res.locals.currentUser=req.user;
    }
  catch(err)
  {
    console.log(err)
    req.flash('error','Please Log in first')
    return res.redirect('/login')
  }
   next();
}