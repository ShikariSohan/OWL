const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router =  express.Router();

router.get('/login', (req, res) => {
    res.render("login");
});

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

        // const passwordMatch = await bcrypt.compare(password,existingUser.password);
        
        // if(!passwordMatch){
        //     req.flash('error',"Invalid Credentials");
        //     return res.redirect('/login');
        // }
        if(!existingUser.isSuperAdmin)
            {
                req.flash('error',"Not an Admin");
                return res.redirect('/login');
            }
       
        const token = jwt.sign({
            email : existingUser.email,
            id: existingUser._id ,
            name : existingUser.name,
            image : existingUser.image.url
        },
            process.env.jwtString,{
                expiresIn : process.env.jwtExpiry
            }
        );
        // set cookie
        res.cookie(process.env.cookieName, token, {
            maxAge: process.env.cookieExpiry,
            httpOnly: true,
            signed: true,
          });
        return res.redirect('/dashboard');

    } catch (err) {
        console.log(err);
        req.flash('error',err.message);
        return res.redirect('/login');
    }

});
// router.post('/superAdminRegister',async(req,res)=>{
//     const {email,password,name,urlimage} = req.body;
//     try{
//         const hashedPassword = await bcrypt.hash(password,12);

//         const admin = await superAdmin.create({
//             email,
//             password: hashedPassword,
//             name,
//             image :{
//                 url : urlimage,
//                 filename : "superAdmin"
//             } 
//         });
//         console.log(admin);
//         res.json(admin)
//     }
//     catch(err)
//     {
//         console.log(err)
//         res.redirect('/')
//     }
    
// });

router.get('/logout',(req,res)=>{
    res.clearCookie(process.env.cookieName);
    res.redirect('/login');
});

module.exports = router;
