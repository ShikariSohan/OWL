const  Mongoose  = require('mongoose');
const schema = Mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

User  =  new schema({
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
    }


});
User.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = Mongoose.model('User',User);
