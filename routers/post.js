const express = require('express');
const router =  express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const multer = require('multer');
const {cloudinary,storage2} = require('../cloudinary')
const upload = multer({storage:storage2});
const timeAgo = require('../utilities/timeAgo');
const upvoteDownvoteOfPosts = require('../models/upvoteAndDownvoteOfPosts');

//New post area
router.get('/new', (req, res) => {
    res.render("newpost");
});
router.post('/new', upload.array('image'), async(req, res) => {
    try{  
    const post = new Post(req.body.post);
    if(req.files)
        post.image = req.files.map(f => ({url:f.path, filename: f.filename}));
    post.author=req.user._id;
    post.upvotes = 0;
    post.downvotes = 0;
    post.comments = 0;
    post.community=req.cookies['communityName'];
    await post.save();  
    
    console.log(post);
    res.redirect('/c/'+req.cookies['communityName']);
    }
    catch(err)
    {
        console.log(err)
        req.flash('error',err.message);
        res.redirect('/');
    }
});
//comment area
router.post('/:id/new/comment',async(req,res)=>{
    try{
        const comment = {
            author : req.user._id,
            comment : req.body.comment,
            post : req.params.id
        }
        const newComment = new Comment(comment);
        await newComment.save();
        await Post.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $inc: {
                comments:1
                }
             });
        const url = '/post/'+ req.params.id;
        res.redirect(url);
    }
    catch(err){
        console.log(err);
        req.flash('error',err.message);
        res.redirect('/');
    }
    
});
//Post get by id area
router.get('/:id', async(req, res) => {
    try{
        let currentuser = req.user;
        const getUser = await User.findOne({_id: currentuser._id})
        const post =  await Post.findOne({ _id: req.params.id});
        const comments = await Comment.find({post: req.params.id}).sort('-updatedAt');
        res.render("post",{post,getUser,timeAgo,comments});
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
});
//Post saving area
router.post('/:id/save', async(req, res) => {
    try{
        currentuser = req.user;
        const post_Id = req.params.id;
        const getUser = await User.findOne({_id: currentuser._id})
        const arr = getUser.saves;
        let saved ;
        if(arr !== undefined)
          saved = arr.find(s => {
           
            return s.equals(post_Id); 
        });
        
        if(saved==undefined || arr==undefined)
        {
            await User.findByIdAndUpdate({_id: currentuser._id},
                { $push: 
                    { 
                        saves: post_Id 
                  } ,
                },
            )
        }
    }
    catch{
        console.log(err);
       
    }
    res.redirect(`/saved/${currentuser._id}`);
});
//Post editing area
router.get('/:id/edit', async(req, res) => {
    try{
    const post =  await Post.findOne({ _id: req.params.id});
    res.render("editPost",{post});
    }
    catch{
        console.log(err); 
    }
    
})
router.put('/:id', upload.array('image'), async(req, res) => {
    try{
    const post =  await Post.updateOne({_id:req.params.id} ,{title: req.body.post.title, description: req.body.post.description});  
    }
    catch{
        console.log(err);   
    }
    res.redirect(`/post/${req.params.id}`);
})
//post deleting area
router.delete('/:id',async(req,res)=>{
    try{
        const post =  await Post.findOne({ _id: req.params.id});
        console.log("uoooo1")
        if(post.image)
        {
           for(let img of post.image)
           {  
            console.log(img.filename)
               await cloudinary.uploader.destroy(img.filename);
           }
           console.log("uoooo2")
        }
        await Comment.deleteMany({post:req.params.id});
        await Post.deleteOne({_id:req.params.id});
        console.log("uoooo3")
        
    }
    catch{
        console.log("uoooo4")
        console.log(err); 
    }
    res.redirect('/');
})
module.exports=router;