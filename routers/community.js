const express = require('express');
const router =  express.Router();
const Community = require('../models/community');
const Post = require('../models/post');
const User = require('../models/user');
const { isLoggedin } = require('../utilities/middlewares');
const timeAgo = require('../utilities/timeAgo');
router.get('/c/new', (req, res) => {
    res.render("newCommunity");
});
router.get('/join/:name', async(req, res) => {
    try{
        const comName = req.params.name;
        const com = await Community.findOne({name:comName});
        if(!com.isPrivate)
        {
            const userresult = await User.findByIdAndUpdate(req.user._id,
                {
                    $push: { community : {
                        communityId: com._id,
                        name:com.name,
                        isAdmin:false
                    } }
                },
                { new: true }
            );
            const comresult = await Community.findByIdAndUpdate({_id:com._id},
                {
                    $push: { member: req.user._id }
                },
                { new: true }
            );

        }
        else {
            const comresult = await Community.findByIdAndUpdate({_id:com._id},
                {
                    $push: { requestedMember: req.user._id }
                },
                { new: true }
            );
            const userresult = await User.findByIdAndUpdate(req.user._id,
                {
                    $push: { requestedCommunity : {
                        name:com.name,
                    } }
                },
                { new: true }
            );
            
        }
        res.redirect('/c/joincommunites');
    }
    catch(err){
        console.log(err);
        res.redirect("/");

    }
});

router.post('/c/new',async(req,res)=>{
    try{
        const {name,description,customRadio}=req.body;
        const community = new Community({name,description});
        if(customRadio=="private")
         community.isPrivate=true;
        else community.isPrivate=false;
        community.member.push(req.user._id);
        community.admin.push(req.user._id);
        const com =  await community.save();
        const result = await User.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    isSuperAdmin:true,
                },
                $push: { community : {
                    communityId: com._id,
                    name:com.name,
                    isAdmin:true
                } }
            },
            { new: true }
        );
        res.redirect('/c/'+name);

        
    }
    catch(err)
    {
        console.log(err);
        res.redirect('/');
    }
   
})

router.post('/c/checkname',async(req,res)=>{
   try{
    const name = req.body.name;
    if(Boolean(name))
    {
        const com = await Community.findOne({name});
        if(com){
            res.json( {
                ok:false
            })
        }
        else{
            res.json( {
                ok:true
            })
        }

    }
   }
    catch(err){
        console.log(err)
        res.json( {
            ok:false
        })
    }
});
router.get('/c/joincommunites',async(req,res)=>{
    try{
        const communities = await Community.find({});
        res.render("joincommunites",{communities});
    }
    catch(err){

    }
   
})
router.get('/c/:name',async(req,res)=>{
    res.clearCookie('communityName');
    res.cookie('communityName', req.params.name);
    const posts =  await Post.find({community : req.params.name}).sort('-createdAt');   
    const getUser = await User.findOne({_id:  res.locals.currentUser._id}) 
    res.render("community",{posts,timeAgo,getUser});
});
module.exports=router;