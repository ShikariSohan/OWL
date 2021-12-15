const  Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

User  =  new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    reg : {
        type : Number,
        required : true,
        unique :  true

    },
    name : {
        type : String,
        required : true
    },
    department : {
        type : String ,
        required : true
    },
    image:{
        url: String,
        filename: String
    },
    upvotes_downvotes:[{
        postId:{ type: Schema.Types.ObjectId , ref:'Post'},
        types: String
    }],

});
User.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = Mongoose.model('User',User);
