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
    parent:{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required : false
    }     
},
{
    timestamps: true
})
CommentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Comment',CommentSchema); 