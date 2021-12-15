if(process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}
const ObjectID = require('mongodb').ObjectID;
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const session = require('express-session');
const flash = require('connect-flash');
const ejsLint = require('ejs-lint');
//const upvoteDownvoteOfPosts = require('./models/upvoteAndDownvoteOfPosts');
const signupRouter = require('./routers/signup');
const loginRouter = require('./routers/login');
const accRouter = require('./routers/myAcc');
const postRouter = require('./routers/post');
const communityRouter = require('./routers/community')
const morgan = require('morgan')
const cors = require('cors')
const http = require( 'http' ).createServer( app )
const io = require( 'socket.io' )( http )
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Post = require('./models/post');
const {isLoggedin} = require('./utilities/middlewares');
const timeAgo = require('./utilities/timeAgo');
const router = require("./routers/community");

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

app.use(morgan('dev'));
//app.use(cors());


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
app.use('/c',isLoggedin,communityRouter);


//home
var currentUser;
app.get('/', isLoggedin,async(req, res) => {
    currentUser = req.user;
    const posts =  await Post.find({}).sort('-createdAt');      
    res.render("home",{posts,timeAgo});
});
//home end

const port = process.env.PORT || 2727 ;
http.listen(port, ()=>{
    console.log(`Listening to the ${port} !!!!!`.brightYellow);
});
//for upvote and downvote
var upvote_count = 0;
var ok = false;
io.on( 'connection', function( socket ) {
    console.log( 'a user has connected!' );
    
    socket.on( 'disconnect', function() {
        console.log( 'user disconnected' );
    });
    
    socket.on( 'upvote-event', async function( upvote_flag , id) {
        console.log(typeof id, typeof currentUser._id);  
        upvote_count = upvote_flag ? 1: -1;
        const post_Id = new ObjectID(id);
        //const upvoteDownvote = await upvoteDownvoteOfPosts.findOneAndUpdate({postId: new ObjectID(id)});
        const bal = await User.findOne({_id: currentUser._id})
        //console.log(bal);
        const arr = bal.upvotes_downvotes;
        console.log(arr);
       var PreClicked ;
       if(arr !== undefined)
          PreClicked = arr.find(clicked => {
            //console.log(clicked.postId,post_Id)
            return clicked.postId.equals(post_Id);
        });
        //var ok = false;
       // console.log(PreClicked, post_Id);
    
        if(upvote_count==1 && (PreClicked==undefined || arr==undefined))
        {
            //upvote_count = 1;
            const newUpvote = { postId: post_Id, types: "upvote" };
            await User.findByIdAndUpdate({_id: currentUser._id},
                { $push: 
                    { 
                        upvotes_downvotes: newUpvote
                  } ,
                },
            )
            
        }
        else if(upvote_count==-1 || PreClicked.types==="upvote"){
            
            if(upvote_count!=-1){
              
                upvote_count=-1
            }
           await User.findByIdAndUpdate({_id: currentUser._id},
            { $pull:
                 { upvotes_downvotes:{
                       postId: post_Id, types: "upvote" 
                    }
                 } 
            })
        }
        else if (PreClicked.types==="downvote")
        {
            upvote_count = 1;
            User.findByIdAndUpdate({_id: currentUser._id},
                 {"upvotes_downvotes.postId": post_Id},
                   { $set: {
                        "upvotes_downvotes.$.types": "upvote"
                    }
                },                      
            )
        }
        //if(PreClicked.types==="upvote")
       
        //console.log(User.findById({_id: user._id}).upvotes_downvotes);                                                                                                       
        const upvoteDownvote = await Post.findByIdAndUpdate(
            {_id: post_Id},
            {
                $inc: {
                upvotes:upvote_count
                }
             },
             {
                 new:true
             });
        
       // console.log(upvoteDownvote);
        io.emit( 'update-upvotes', upvoteDownvote.upvotes);
    });
});
    
    