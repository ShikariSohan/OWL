const  Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

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
    password : {
        type : String,
    },
    department : {
        type : String ,
        required : true
    },
    image:{
        url: String,
        filename: String
    },
    avatar:{
        url: String,
        filename: String
    },
    isVerified:{
        type :Boolean ,
        default : false
    },
    saves:[{
        type: Schema.Types.ObjectId,
        ref:'Post',
        autopopulate: true
    }],
    upvotes_downvotes:[{
        postId:{ type: Schema.Types.ObjectId , ref:'Post'},
        types: String
    }],
    isSuperAdmin:{
        type:Boolean , 
        default : false
    },
    community:[{
        name :{type:String},
        isAdmin:{
            type :Boolean ,
            default : false
        }
    }],
    requestedCommunity:[{
        name :{type:String}
    }]

});
User.plugin(require('mongoose-autopopulate'));
module.exports = Mongoose.model('User',User);
