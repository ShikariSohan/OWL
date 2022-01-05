const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const router =  express.Router();
const timeAgo = require('../utilities/timeAgo');
const User = require('../models/user')
router.get('/:id', async (req, res) => {
    try{
        console.log(typeof req.user._id,typeof req.params.id);
        if(req.user._id.toString() === req.params.id.toString()){
        const user =  await User.findOne({ _id: req.params.id});
        res.render("saved",{user,timeAgo});
        }
        else
        {
            res.redirect("/");
        }
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
});

module.exports=router;