const express = require('express');
const router =  express.Router();
const departments = require('../utilities/departments');
const User = require('../models/user')

router.get('/',(req,res)=>{
    res.render('signup',{departments});
});

router.post('/', async (req, res) => {
  try{
    const {name,department,reg,email,password} = req.body;
    const user = new User({email:email,name:name,department:department,reg:reg});
    const newUser = await User.register(user,password);
    console.log(newUser);
    res.redirect('/');
  }
  catch (err)
  {
      req.flash('error',err.message);
      res.redirect('/signup');
  }
   
});

module.exports = router;
