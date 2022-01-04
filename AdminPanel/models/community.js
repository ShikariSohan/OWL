const  Mongoose  = require('mongoose');
const Schema = Mongoose.Schema;

Community  =  new Schema({
    name : {
        type : String,
        required : true
    },
    isPrivate : {
        type : Boolean,
        required : false
    },
    post:[{
        postId:{ type: Schema.Types.ObjectId , ref:'Post'}
    }],
    member:[{
        memberId:{ type: Schema.Types.ObjectId , ref:'User'}
    }],
    admin:[{
        adminId:{ type: Schema.Types.ObjectId , ref:'User'}
    }]
});
module.exports = Mongoose.model('Community',Community);
