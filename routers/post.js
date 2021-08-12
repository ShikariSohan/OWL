const express = require('express');
const router =  express.Router();
const Post = require('../models/post')
const multer = require('multer');
const {storage2} = require('../cloudinary')
const upload = multer({storage:storage2});

router.get('/new', (req, res) => {
    res.render("newpost");
});
router.post('/new', upload.array('image'), async(req, res) => {
    try{  
    const post = new Post(req.body.post);
    console.log(req.body.post)
    if(req.files)
     post.image = req.files.map(f => ({url:f.path, filename: f.filename}));
    post.author=req.user._id;
    await post.save();
    res.redirect('/');
    }
    catch(err)
    {
        req.flash('error',err.message);
        res.redirect('/');
    }
});
module.exports=router;