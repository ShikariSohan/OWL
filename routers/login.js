const express = require('express');
const router =  express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// showing login page
router.get('/login', (req, res) => {
    res.render("login");
});
// logged in a user 
router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    try {
        if(!email || !password)
        {
            req.flash('error',"Nothing Here");
            return res.redirect('/login');
        }
        const existingUser = await User.findOne({ email });

        if(!existingUser){
            console.log("user Not Found");
            req.flash('error',"User Not Found");
            return res.redirect('/login');
        }

        const passwordMatch = await bcrypt.compare(password,existingUser.password);
        
        if(!passwordMatch){
            req.flash('error',"Invalid Credentials");
            return res.redirect('/login');
        }
       
        const token = jwt.sign({
            email : existingUser.email,
            _id: existingUser._id ,
            name : existingUser.name,
            image : existingUser.avatar.url
        },
            process.env.jwtString,{
                expiresIn : process.env.jwtExpiry
            }
        );

        // set cookie
        res.cookie(process.env.cookieUserName, token, {
            maxAge: process.env.cookieExpiry,
            httpOnly: true,
            signed: true,
          });
  

        console.log(token);
        return res.redirect('/');

    } catch (err) {
        console.log(err);
        req.flash('error',err.message);
        return res.redirect('/login');
    }
});
// logout a user
router.get('/logout',(req,res)=>{
    res.clearCookie(process.env.cookieUserName);
    res.redirect('/login');
});

module.exports = router;
