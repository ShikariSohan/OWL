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
const User = require('./models/user');
const Post = require('./models/post');
const {isLoggedin} = require('./utilities/middlewares');
const timeAgo = require('./utilities/timeAgo');
const router = require("./routers/community");
const cookieParser = require('cookie-parser');

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

app.use(express.static(__dirname + '/public'));

const sessionConfig = {
    secret:"Shikari Is awesome",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionConfig));
app.use(flash());
app.use(cookieParser(process.env.cookieString));

app.use(morgan('dev'));
//app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set('views', path.join(__dirname, '/views'));

app.use((req,res,next)=>{
    res.locals.error = req.flash('error');
    next();
});

app.use('/signup',signupRouter);
app.use('/',loginRouter);
app.use('/profile',isLoggedin,accRouter);
app.use('/post',isLoggedin,postRouter);
app.use('/c',isLoggedin,communityRouter);


//home
let currentuser;
app.get('/',isLoggedin,async(req, res) => {
    currentuser = req.user;
    const posts =  await Post.find({}).sort('-createdAt');   
    const getUser = await User.findOne({_id: currentuser._id}) 
    res.render("home",{posts,timeAgo,getUser});
});
//home end

const port = process.env.PORT || 2727 ;
http.listen(port, ()=>{
    console.log(`Listening to the ${port} !!!!!`.brightYellow);
});

//broadcasting upvote and downvote to each user 
io.on( 'connection', function( socket ) {
    console.log( 'a user has connected!' ); // check user is connected
    
    socket.on( 'disconnect', function() {
        console.log( 'user disconnected' ); // check user is disconnected
    });
    //Upvoting section
   let upvote_count = 0; // to count total upvote
    // check if upvote button is clicked
    socket.on( 'upvote-event', async function(id) {

        //console.log(typeof id, typeof currentUser._id);  
        let ok = false; // set variable to check downvote was previously clicked
        let upButton = false; // to change the button color
        const post_Id = new ObjectID(id); // make the post id string to mongoose object id
        //const upvoteDownvote = await upvoteDownvoteOfPosts.findOneAndUpdate({postId: new ObjectID(id)});
        const getUser = await User.findOne({_id: currentuser._id}) // get current user
      
        const arr = getUser.upvotes_downvotes; // get the upvotes_downvotes array from current user
        
       let PreClicked ;
       if(arr !== undefined)
          PreClicked = arr.find(clicked => {
            //console.log(clicked.postId,post_Id)
            return clicked.postId.equals(post_Id); // check if upvote button clicked previously
        });
        //var ok = false;
       // console.log(PreClicked, post_Id);
    
        if((PreClicked==undefined || arr==undefined)) // check if upvote button clicked for first time
        {
            upButton = true; // change to make clicked button blue
            upvote_count = 1; // set value to 1
            const newUpvote = { postId: post_Id, types: "upvote" };
            await User.findByIdAndUpdate({_id: currentuser._id},
                { $push: 
                    { 
                        upvotes_downvotes: newUpvote // push to upvotes_downvotes array
                  } ,
                },
            )
            
        }
        else if (PreClicked!=undefined && PreClicked.types==="downvote") // if downvote button was previously clicked
        {
            upButton = true;
            upvote_count = 1;
            ok =true;
           await User.updateOne({_id: currentuser._id, "upvotes_downvotes.postId": post_Id},
                   { $set: {
                        "upvotes_downvotes.$.types": "upvote" // change the button clicked type to "upvote"
                    }
                },                      
            )
        }
        else if(PreClicked.types==="upvote"){ //check if upvote button is clicked twice
            upButton = false; // set upButton false
            if(upvote_count!=-1){
              
                upvote_count=-1
            }
           await User.findByIdAndUpdate({_id: currentuser._id},
            { $pull:
                 { upvotes_downvotes:{
                       postId: post_Id, types: "upvote" // remove the document
                    }
                 } 
            })
        }
       
        //if(PreClicked.types==="upvote")
       
        //console.log(User.findById({_id: user._id}).upvotes_downvotes);                                                                                                       
        const upvoteDownvote = await Post.findByIdAndUpdate(
            {_id: post_Id},
            {
                $inc: {
                upvotes:upvote_count //update the number of upvotes
                }
             },
             {
                 new:true
             });
            if(ok) // check if downvote button was clicked previously and now upvote button is clicked
            {
               upvoteDownvote.downvotes = upvoteDownvote.downvotes-1; //decrement downvote nuber
               await upvoteDownvote.save(); //save the document
            }
        
       //update result on client side
        io.emit( 'update-upvotes', upvoteDownvote.upvotes,upvoteDownvote.downvotes,upButton);
    }); // upvote section end

    //downvotes section
    let downvote_count = 0; // to count total downvote
    // check if downvote button is clicked
    socket.on( 'downvote-event', async function( id) {
        let ok = false;// set variable to check upvote was previously clicked
        let downButton = false;// to change the button color  
        const post_Id = new ObjectID(id); // make the post id string to mongoose object id
        const getUser = await User.findOne({_id: currentuser._id}) //find current user continously
        const arr = getUser.upvotes_downvotes;
       let PreClicked ;
       if(arr !== undefined)
          PreClicked = arr.find(clicked => { //check if downvote button was clicked previously
            //console.log(clicked.postId,post_Id)
            return clicked.postId.equals(post_Id);
        });
       
        if( (PreClicked==undefined || arr==undefined)) //if post id does not exist in user array
        {
            downButton = true
            downvote_count=1; //update downvote
            const newDownvote = { postId: post_Id, types: "downvote" };
            await User.findByIdAndUpdate({_id: currentuser._id},
                { $push: 
                    { 
                        upvotes_downvotes: newDownvote // push new downvote
                  } ,
                },
            )
            
        }
        else if (PreClicked!=undefined && PreClicked.types==="upvote") // if upvote was clicked previously
        {
            downButton = true;
            downvote_count = 1;
            ok = true;
           await User.updateOne({_id: currentuser._id, 'upvotes_downvotes.postId' : post_Id},
                   { $set: {
                        "upvotes_downvotes.$.types": "downvote" //update the type
                    }
                },                      
            )
        }
        else if(PreClicked.types==="downvote"){ // if downvote button is clicked twice
            downButton = false
            
            if(downvote_count!=-1){
              
                downvote_count=-1
            }
           await User.findByIdAndUpdate({_id: currentuser._id},
            { $pull:
                 { upvotes_downvotes:{
                       postId: post_Id, types: "downvote" // remove the document
                    }
                 } 
            })
        }
       
        //if(PreClicked.types==="upvote")
       
        //console.log(User.findById({_id: user._id}).upvotes_downvotes);                                                                                                       
        const upvoteDownvote = await Post.findByIdAndUpdate(
            {_id: post_Id},
            {
                $inc: {
                downvotes:downvote_count // update downvotes
                }
             },
             {
                 new:true
             });
        
       // console.log(upvoteDownvote);
       if(ok)
       {
        upvoteDownvote.upvotes-=1; //decrement if upvote button was clicked previously 
        await upvoteDownvote.save(); //save the user document
       }
        io.emit( 'update-downvotes', upvoteDownvote.upvotes,upvoteDownvote.downvotes,downButton);
    });
});
    
    