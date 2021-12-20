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
const morgan = require('morgan');
const dashboardRouter = require('./routers/dashboard');
const loginRouter = require('./routers/login');
const newrequestRouter = require('./routers/newrequest');
const cookieParser = require('cookie-parser');
const { isLoggedin } = require("./utils/common");
mongoose.connect(process.env.mongoURL,
    { useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
.then(()=>{ 
    console.log("Connected to databases!!".rainbow)
})
.catch(err=>{
    console.log("Sorry, cannot connect!".red)
    console.log(err)
})

app.use(express.static(__dirname + '/public'));
app.use(cookieParser(process.env.cookieString));

const sessionConfig = {
    secret:"Shikari Is awesome",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionConfig));

app.use(flash());

app.use(morgan('dev'));

app.set("view engine","ejs");
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    res.locals.error = req.flash('error');
    next();
});


app.use('/',loginRouter);
app.use('/',dashboardRouter);
app.use('/',newrequestRouter);

//home
app.get('/',isLoggedin,(req, res) => {
    res.redirect("/dashboard");
});
//home end

// app.post('/superAdminSignup',async(req,res)=>{
//     const {email,name,image} = req.body;
//     const shikari = new superAdmin({email,name});
//     shikari.image = {url: image, filename: "avatarOfsuperadmin1"};
//     console.log(shikari);
//     const done = await superAdmin.register(shikari,"riyoandshikari");
//     res.send(done);

// });

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Listening to the ${port} !!!!!`.brightYellow);
});