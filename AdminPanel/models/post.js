const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref:'User',
        autopopulate: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
    type:String,
    required: true
    },
    image:[
        {
            url:String,
            filename:String
        }
    ],
    upvotes:{
        type:Number,
        defafult:0
    },
    downvotes:{
        type:Number,
        default:0
    },
    comments:{
        type:Number,
        default:0
    } , 
    community:{
        type:String
    } 
},
{
    timestamps: true
})
PostSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Post',PostSchema); 