const express = require('express');
const router =  express.Router();
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render("login");

});

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    res.redirect('/');
});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
});

module.exports = router;
