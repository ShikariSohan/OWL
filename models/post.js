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
    ]
       
},
{
    timestamps: true
})
PostSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Post',PostSchema); 