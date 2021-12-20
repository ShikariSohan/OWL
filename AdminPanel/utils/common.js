const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
module.exports.isLoggedin = (req,res,next)=>{

    let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies[process.env.cookieName]) {
      token = cookies[process.env.cookieName];
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

module.exports.tempPassword = async()=>{

  let password='';

    for(let i=0;i<8;++i){
        const val = Math.round(Math.random()*8);
        password+=val;
    }
    const hashedPassword = await bcrypt.hash(password,12);
    return {
      password,hashedPassword
    };

}