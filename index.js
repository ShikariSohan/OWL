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
const methodOverride = require('method-override');
//const upvoteDownvoteOfPosts = require('./models/upvoteAndDownvoteOfPosts');
const signupRouter = require('./routers/signup');
const loginRouter = require('./routers/login');
const accRouter = require('./routers/myAcc');
const postRouter = require('./routers/post');
const saveRouter = require('./routers/saved');
const contributors = require('./routers/contributors')
const communityRouter = require('./routers/community')
const morgan = require('morgan')
const cors = require('cors')
const http = require( 'http' ).createServer( app )
const io = require( 'socket.io' )( http )
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const {isLoggedin} = require('./utilities/middlewares');
const timeAgo = require('./utilities/timeAgo');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(cookieParser(process.env.cookieString));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
//app.use(cors());




app.set("view engine","ejs");
app.set('views', path.join(__dirname, '/views'));

app.use((req,res,next)=>{
    res.locals.error = req.flash('error');
    next();
});

app.use('/signup',signupRouter);
app.use('/',loginRouter);
app.use('/profile',isLoggedin,accRouter);
app.use('/saved',isLoggedin,saveRouter);
app.use('/post',isLoggedin,postRouter);
app.use('/',isLoggedin,communityRouter);


app.get('/search',isLoggedin,async(req,res)=>{
    const {searchText} = req.query;
    const posts = await Post.find({title : {"$regex": searchText, "$options": "i" }});
    res.render('search',{posts,timeAgo,searchText})
    
})

//home
let currentuser;
app.get('/',isLoggedin,async(req, res) => {
    currentuser = req.user;
    res.clearCookie('communityName');
    res.cookie('communityName', 'Owl');
    //const posts =  await Post.find({community : "Owl"}).sort('-createdAt');
    const users =  await User.find().sort({ contribution:-1 });   
    const posts =  await Post.find({}).sort('-createdAt');   
    const getUser = await User.findOne({_id: currentuser._id}) 
    res.render("home",{posts,timeAgo,getUser,users});
});
app.get('/topcontributors',isLoggedin,async(req,res)=>{
    try{
        const users =  await User.find().sort({ contribution:-1 });
        res.render("topcontributors",{users});
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }
})
//saved



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
    socket.on( 'upvote-event', async function(id,id2) {
        const currentuser_id = new ObjectID(id2);
        let ok = false; // set variable to check downvote was previously clicked
        let upButton = false; // to change the button color
        const post_Id = new ObjectID(id); // make the post id string to mongoose object id
        //const upvoteDownvote = await upvoteDownvoteOfPosts.findOneAndUpdate({postId: new ObjectID(id)});
        console.log(id2);
        const getUser = await User.findOne({_id: currentuser_id}) // get current user
        console.log(getUser);
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
            await User.findByIdAndUpdate({_id: currentuser_id},
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
           await User.updateOne({_id: currentuser_id, "upvotes_downvotes.postId": post_Id},
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
           await User.findByIdAndUpdate({_id: currentuser_id},
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
       let points = upvote_count*5;
       const author = await User.findByIdAndUpdate({_id: upvoteDownvote.author._id},
        {
           $inc:{
               contribution:points
           },
        })
        io.emit( 'update-upvotes', upvoteDownvote.upvotes,upvoteDownvote.downvotes,upButton);
    }); // upvote section end

    //downvotes section
    let downvote_count = 0; // to count total downvote
    // check if downvote button is clicked
    socket.on( 'downvote-event', async function(id,id2) {
        console.log(id,id2)
        const currentuser_id = new ObjectID(id2);
        let ok = false;// set variable to check upvote was previously clicked
        let downButton = false;// to change the button color  
        const post_Id = new ObjectID(id); // make the post id string to mongoose object id
        const getUser = await User.findOne({_id: currentuser_id}) //find current user continously
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
            await User.findByIdAndUpdate({_id: currentuser_id},
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
           await User.updateOne({_id: currentuser_id, 'upvotes_downvotes.postId' : post_Id},
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
       let points= - downvote_count*5;
       const author = await User.findByIdAndUpdate({_id: upvoteDownvote.author._id},
        {
           $inc:{
               contribution:points
           },
        })
        io.emit( 'update-downvotes', upvoteDownvote.upvotes,upvoteDownvote.downvotes,downButton);
    });
     //Upvoting comment section
   let upvote_count_comment = 0; // to count total upvote
   // check if upvote button is clicked
   socket.on( 'upvote-event-comment', async function(id,id2) {
    const currentuser_id = new ObjectID(id2);
     
       let ok = false; // set variable to check downvote was previously clicked
       let upButton = false; // to change the button color
       const comment_Id = new ObjectID(id); // make the post id string to mongoose object id
       //const upvoteDownvote = await upvoteDownvoteOfPosts.findOneAndUpdate({postId: new ObjectID(id)});
       const getUser = await User.findOne({_id: currentuser_id}) // get current user
       
       const arr = getUser.upvotes_downvotes_comment; // get the upvotes_downvotes array from current user
       
      let PreClicked ;
      if(arr !== undefined)
         PreClicked = arr.find(clicked => {
           //console.log(clicked.postId,post_Id)
           return clicked.commentId.equals(comment_Id); // check if upvote button clicked previously
       });
       //var ok = false;
      // console.log(PreClicked, post_Id);
   
       if((PreClicked==undefined || arr==undefined)) // check if upvote button clicked for first time
       {
           upButton = true; // change to make clicked button blue
           upvote_count_comment = 1; // set value to 1
           const newUpvote = { commentId: comment_Id, types: "upvote" };
           await User.findByIdAndUpdate({_id: currentuser_id},
               { $push: 
                   { 
                       upvotes_downvotes_comment: newUpvote // push to upvotes_downvotes array
                 } ,
               },
           )
           
       }
       else if (PreClicked!=undefined && PreClicked.types==="downvote") // if downvote button was previously clicked
       {
           upButton = true;
           upvote_count_comment = 1;
           ok =true;
          await User.updateOne({_id: currentuser_id, "upvotes_downvotes_comment.commentId": comment_Id},
                  { $set: {
                       "upvotes_downvotes_comment.$.types": "upvote" // change the button clicked type to "upvote"
                   }
               },                      
           )
       }
       else if(PreClicked.types==="upvote"){ //check if upvote button is clicked twice
           upButton = false; // set upButton false
           if(upvote_count_comment!=-1){
             
               upvote_count_comment=-1
           }
          await User.findByIdAndUpdate({_id: currentuser_id},
           { $pull:
                { upvotes_downvotes_comment:{
                      commentId: comment_Id, types: "upvote" // remove the document
                   }
                } 
           })
       }
      
       //if(PreClicked.types==="upvote")
      
       //console.log(User.findById({_id: user._id}).upvotes_downvotes);                                                                                                       
       const upvoteDownvote = await Comment.findByIdAndUpdate(
           {_id: comment_Id},
           {
               $inc: {
               upvotes:upvote_count_comment //update the number of upvotes
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
           let points = upvote_count_comment*10;
           const author = await User.findByIdAndUpdate({_id: upvoteDownvote.author._id},
            {
               $inc:{
                   contribution:points
               },
            })
      //update result on client side
       io.emit( 'update-upvotes-comment', upvoteDownvote.upvotes,upvoteDownvote.downvotes,upButton);
   }); // upvote section end

   //downvotes section
   let downvote_count_comment = 0; // to count total downvote
   // check if downvote button is clicked
   socket.on( 'downvote-event-comment', async function( id,id2) {
      const currentuser_id = new ObjectID(id2);
       let ok = false;// set variable to check upvote was previously clicked
       let downButton = false;// to change the button color  
       const comment_Id = new ObjectID(id); // make the post id string to mongoose object id
       const getUser = await User.findOne({_id: currentuser_id}) //find current user continously
       const arr = getUser.upvotes_downvotes_comment;
      let PreClicked ;
      if(arr !== undefined)
         PreClicked = arr.find(clicked => { //check if downvote button was clicked previously
           //console.log(clicked.postId,post_Id)
           return clicked.commentId.equals(comment_Id);
       });
      
       if( (PreClicked==undefined || arr==undefined)) //if post id does not exist in user array
       {
           downButton = true
           downvote_count_comment=1; //update downvote
           const newDownvote = { commentId: comment_Id, types: "downvote" };
           await User.findByIdAndUpdate({_id: currentuser_id},
               { $push: 
                   { 
                       upvotes_downvotes_comment: newDownvote // push new downvote
                 } ,
               },
           )
           
       }
       else if (PreClicked!=undefined && PreClicked.types==="upvote") // if upvote was clicked previously
       {
           downButton = true;
           downvote_count_comment = 1;
           ok = true;
          await User.updateOne({_id: currentuser_id, 'upvotes_downvotes_comment.commentId' : comment_Id},
                  { $set: {
                       "upvotes_downvotes_comment.$.types": "downvote" //update the type
                   }
               },                      
           )
       }
       else if(PreClicked.types==="downvote"){ // if downvote button is clicked twice
           downButton = false
           
           if(downvote_count_comment!=-1){
             
               downvote_count_comment=-1
           }
          await User.findByIdAndUpdate({_id: currentuser_id},
           { $pull:
                { upvotes_downvotes_comment:{
                     commentId: comment_Id, types: "downvote" // remove the document
                   }
                } 
           })
       }
      
       //if(PreClicked.types==="upvote")
      
       //console.log(User.findById({_id: user._id}).upvotes_downvotes);                                                                                                       
       const upvoteDownvote = await Comment.findByIdAndUpdate(
           {_id: comment_Id},
           {
               $inc: {
               downvotes:downvote_count_comment // update downvotes
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
      let points = -downvote_count_comment*10;
       const author = await User.findByIdAndUpdate({_id: upvoteDownvote.author._id},
        {
           $inc:{
               contribution:points
           },
        })
       io.emit( 'update-downvotes-comment', upvoteDownvote.upvotes,upvoteDownvote.downvotes,downButton);
   });
   socket.on('starbtn',async function(id)
   {
       const cmntId = id;
       id = new ObjectID(id);
       const comment = await Comment.findOne(id)
       comment.star = true;
       await comment.save();
       let points = 25;
       const author = await User.findByIdAndUpdate({_id: comment.author._id},
        {
           $inc:{
               contribution:points
           },
        })
        io.emit( 'update-star',cmntId);
   }
   )
});
    
    