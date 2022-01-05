//IGNORE THIS FILE 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UpvoteDownvoteOfPostsSchema = new Schema({
    upvotes:{
        type:Number,
        default:0,
        
    },
    downvotes:{
        type:Number,
        default:0
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
},
    {
        timestamps: true
    },
);
module.exports = mongoose.model('UpvoteDownvoteOfPosts',UpvoteDownvoteOfPostsSchema)
