const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
mongoose.connect('mongodb://localhost:27017/posts',{useNewUrlParser: true})
.then(()=>{
    console.log("Connected to databases!!".rainbow)
})
.catch(err=>{
    console.log("Sorry, cannot connect!".red)
    console.log(err)
})



app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");
app.set('views', path.join(__dirname, '/views'));
app.get('/', (req, res) => {
        res.render("login");
    
})
app.get('/login', (req, res) => {
    res.render("login");

})
app.get('/SignUp', (req, res) => {
    res.render("SignUp");

})


var port = process.env.PORT || 2727 ;
app.listen(port, ()=>{
    console.log(`Listening to the ${port} !!!!!`.brightYellow);
});