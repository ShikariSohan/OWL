const express = require('express');
const router =  express.Router();

router.get('/new', (req, res) => {
    res.render("newCommunity");
});
router.post('/new',(req,res)=>{
    console.log(req.body);
    res.redirect('/');
})

module.exports=router;