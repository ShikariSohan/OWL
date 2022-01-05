const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true,
        required: true
    },
    comment:{
        type:String,
        required: true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref:'User', //post ref user? fishy
        autopopulate: true,
        required: true
    },
    upvotes:{
        type:Number
    },
    downvotes:{
        type:Number
    },
    IsReply:{
        type:Boolean
    },
    reply:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate:true
    } ]   
},
{
    timestamps: true
})
CommentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Comment',CommentSchema); 