const express = require('express');
const router =  express.Router();
const User = require('../models/user')
router.get('/:id', async (req, res) => {
    try{
        const user =  await User.findOne({ _id: req.params.id});
        console.log(user);
        res.render("myAcc",{user});
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
});

module.exports=router;