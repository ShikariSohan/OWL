const express = require('express');
const { isLoggedin } = require('../utils/common');
const router =  express.Router();
router.use(isLoggedin);
router.get('/dashboard', (req, res) => {
    try{
        res.render('dashboard');
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
