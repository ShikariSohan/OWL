const express = require('express');
const { isLoggedin } = require('../utils/common');
const User = require('../models/user');
const Post = require('../models/post');
const Community = require('../models/community');
const router =  express.Router();
router.use(isLoggedin);
router.get('/dashboard', async(req, res) => {
    try{
       const totalUser = await User.count();
       const totalPost = await Post.count();
       const totalCommunity = await Community.count();
       const totalRequest = await User.count({isVerified:false});
       const newUsers = await User.find({isVerified:true}).limit(4);
       res.render('dashboard',{
           totalPost,totalUser,totalRequest,totalCommunity,newUsers
       })
    }
    catch(err)
    {
        console.log(err);
    }

});

router.get('/profile/:id',(req,res)=>{
    res.render('profile');
})

module.exports = router;
