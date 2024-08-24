const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content:{
        type: String,
        required: true,
    },
    createdBy: { //this field is used to store the user id of the user who created the blog, and it points to the user collection.
        type: Schema.Types.ObjectId, //refers to the user who created the blog, by their object id which is stored in the user collection.
        ref: 'User', //refers to the User model.
    },
    BlogId:{
        type: Schema.Types.ObjectId,
        ref: 'Blog',
    },

}, {timestamps: true});

const Comment = model('userComment', commentSchema);

module.exports = Comment;