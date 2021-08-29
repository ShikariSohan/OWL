if(process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const session = require('express-session');
const flash = require('connect-flash');
const ejsLint = require('ejs-lint');
const time_ago = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en');
const Post = require('./models/post');
const signupRouter = require('./routers/signup');
const loginRouter = require('./routers/login');
const accRouter = require('./routers/myAcc');
const postRouter = require('./routers/post');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const {isLoggedin} = require('./utilities/middlewares');

time_ago.addDefaultLocale(en);
const timeAgo = new time_ago('en-US');

mongoose.connect(process.env.mongoCloudURL,
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

app.use(express.static(__dirname + '/public'));

const sessionConfig = {
    secret:"Shikari Is awesome",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionConfig));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set('views', path.join(__dirname, '/views'));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy( { usernameField : 'email' },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    next();
});

app.use('/signup',signupRouter);
app.use('/',loginRouter);
app.use('/profile',isLoggedin,accRouter);
app.use('/post',isLoggedin,postRouter);

//home
app.get('/', isLoggedin,async(req, res) => {
    const posts =  await Post.find({}).sort('-createdAt');      
    res.render("home",{posts,timeAgo});
});
//home end

const port = process.env.PORT || 2727 ;
app.listen(port, ()=>{
    console.log(`Listening to the ${port} !!!!!`.brightYellow);
});