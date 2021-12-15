const express = require('express');
const router =  express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
const multer = require('multer');
const {storage2} = require('../cloudinary')
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
    await post.save();  
    
    console.log(post);
    res.redirect('/');
    }
    catch(err)
    {
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
        const url = '/post/'+ req.params.id;
        res.redirect(url);
    }
    catch(err){
        console.log(err);
        req.flash('error',err.message);
        res.redirect('/');
    }
    
});
//Post area
router.get('/:id', async(req, res) => {
    try{
        const post =  await Post.findOne({ _id: req.params.id});
        const comments = await Comment.find({post: req.params.id}).sort('-updatedAt');
        res.render("post",{post,timeAgo,comments});
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
});


module.exports=router;