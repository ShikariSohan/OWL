const express = require('express');
const router =  express.Router();

router.get('/:username', (req, res) => {
    res.render("myAcc");
});

module.exports=router;