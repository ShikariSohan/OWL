const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const { isLoggedin,tempPassword } = require('../utils/common');
const { mailSender } = require('../utils/mail');
const { passwordTemplate } = require('../utils/mailTemplate');
const router =  express.Router();
router.use(isLoggedin);

router.get('/newrequest',async(req,res)=>{
    try {
        const requests =  await User.find({isVerified:false});
        const totalRequest = await User.count({isVerified:false});
        res.render('newRequest',{
            newUsers:requests,
            totalRequest
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
        const totalRequest = await User.count({isVerified:false});
        res.render("newRequestProfile",{newUser,totalRequest});
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
        console.log(password)
        const result = await User.findByIdAndUpdate(userId,
            {
                $set: {
                    isVerified:true,
                    password:hashedPassword,
                    avatar:{
                        url:"https://res.cloudinary.com/kongkacloud/image/upload/v1640077406/Pngtree_cartoon_owl_teacher_1045061_vzyilt.png",
                        filename:"userDefaultAvatar"
                    }
                },
                $push: {
                    community : {
                        isAdmin : false,
                        name : "Owl"
                    }
                }

            },
            { new: true }
        );
        const community = await Community.findOneAndUpdate({name:"Owl"},
        {
            $push: {
                member : {
                    _id : userId
                }
            }
        })
        const mailResult = await mailSender(
            result.email,
            "You account is Verified",
            passwordTemplate(password)
        );
        console.log("Your Password is :"+password);
        console.log(mailResult);
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
