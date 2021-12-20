const express = require('express');
const router =  express.Router();
const departments = require('../utilities/departments');
const User = require('../models/user');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});


router.get('/',(req,res)=>{
    res.render('signup',{departments});
});

router.post('/',upload.single('image') ,async (req, res) => {
  try{
    const {name,department,reg,email} = req.body.user;
    const user = new User({email:email,name:name,department:department,reg:reg});
    user.image = {url: req.file.path, filename: req.file.filename};
    const newUser = await User.create(user);
    console.log(newUser);
    req.flash('error',"Please Watch your email for your verification");
    res.redirect('/login');
  }
  catch (err)
  {
      req.flash('error',err.message);
      res.redirect('/signup');
  }
   
});

module.exports = router;
