const express = require('express');
const { isLoggedin,tempPassword } = require('../utils/common');
const { mailSender } = require('../utils/mail');
const router =  express.Router();
const User = require('../models/user');
router.use(isLoggedin);

router.get('/newrequest',async(req,res)=>{
    try {
        const requests =  await User.find({isVerified:false});
        res.render('newRequest',{
            newUsers:requests
        });

    }
    catch (err){
        console.log(err);
        res.redirect('/');
    }
   
});
router.get('/newrequest/:id',async(req,res)=>{
    try{
        const newUser =  await User.findOne({ _id: req.params.id});
        res.render("newRequestProfile",{newUser});
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
});
router.post('/approve/:id',async(req,res)=>{
    try{
        let userId = req.params.id;
        let {password,hashedPassword} = await tempPassword();
        const result = await User.findByIdAndUpdate(userId,
            {
                $set: {
                    isVerified:true,
                    password:hashedPassword,
                    avatar:{
                        url:"https://res.cloudinary.com/kongkacloud/image/upload/v1639943358/StudentForum/qffsqikrzgwznfe5pmhy.jpg",
                        filename:"userDefaultAvatar"
                    }
                }
            },
            { new: true }
        );
        const mailResult = await mailSender(
            result.email,
            "You account is Verified",
            `<h1>Your password is :${password}</h1>`
        );
        res.redirect("/newrequest");
    }
    catch(err)
    {
        console.log(err)
        res.send(err)
    }
    

});
router.post('/reject/:id',async(req,res)=>{
    try{
        let userId = req.params.id;
        const deletedId = await User.findByIdAndDelete(userId);
        console.log(deletedId);
        res.redirect("/newrequest");
    }
    catch(err)
    {
        console.log(err)
        res.send(err)
    }
    

});


module.exports = router;
