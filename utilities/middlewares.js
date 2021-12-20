const jwt = require('jsonwebtoken');

module.exports.isLoggedin = (req,res,next)=>{

    let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies[process.env.cookieUserName]) {
      token = cookies[process.env.cookieUserName];
      const decoded = jwt.verify(token, process.env.jwtString);
      req.user = decoded;
      res.locals.currentUser=req.user;
    }
  else
  {
    return res.redirect('/login')
  }
   next();
}