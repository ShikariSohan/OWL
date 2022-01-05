const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const router =  express.Router();
const timeAgo = require('../utilities/timeAgo');
const User = require('../models/user')
router.get('/:id', async (req, res) => {
    try{
        console.log(typeof req.user._id,typeof req.params.id)
        console.log(req.user._id,req.params.id)
        const user_id = new ObjectID(req.params.id); 
        console.log(user_id,req.params.id)
        if(user_id.equals(req.user._id)){
            
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