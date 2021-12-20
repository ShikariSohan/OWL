const  Mongoose  = require('mongoose');
const schema = Mongoose.Schema;

superAdmin  =  new schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    image:{
        url: String,
        filename: String
    },
    password:{
        type : String,
        required : true
    }
});
module.exports = Mongoose.model('superAdmin',superAdmin);
