const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const bcrypt = require('bcrypt');
const User = require('./models/user');
mongoose.connect(process.env.mongoURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
.then(()=>{
    console.log("Connected to databases!!".rainbow)
})
.catch(err=>{
    console.log("Sorry, cannot connect!".red)
    console.log(err)
})
// This function will create a superAdmin for us for our Admin Panel
const createAdmin = async ()=>{
// edit these fields as you like without hash
let email = "moksedur.rahman.sohan@gmail.com";
let password = "letsgotothemall";
let hash = await bcrypt.hash(password,12);//Do not edit this 
let name = "ShikariSohan";
let department="CSE";
let reg = "2018331088";
let image = {
    url:'https://res.cloudinary.com/kongkacloud/image/upload/v1641391458/admin70_x7o6ve.png',
    filename:"AdminImage"
}
let avatar = {
    url:'https://res.cloudinary.com/kongkacloud/image/upload/v1641391458/admin70_x7o6ve.png',
    filename:"AdminImage"
}
let isVerified=true; //Do not edit this 
let isSuperAdmin = true; //Do not edit this 
let contribution = 100;
const user = new User({name,department,reg,email,hash,image,avatar,isSuperAdmin,isVerified});
const newUser = await User.create(user);
console.log(newUser);
let comName = "Owl"; //Do not edit this 
let description = "This is for all users.";
const community = new Community({name,description});
community.isPrivate=false;
community.member.push(newUser._id);
community.admin.push(newUser._id);
const com =  await community.save();
const result = await User.findByIdAndUpdate(newUser._id,
    {
        $set: {
            isSuperAdmin:true,
        },
        $push: { community : {
            communityId: com._id,
            name:com.name,
            isAdmin:true
        } }
    },
    { new: true }
);
console.log(result);
}
createAdmin();






