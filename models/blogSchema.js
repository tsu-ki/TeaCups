const {Schema, model} = require('mongoose');

const blogSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false,
    },
    createdBy: { //this field is used to store the user id of the user who created the blog, and it points to the user collection.
        type: Schema.Types.ObjectId, //refers to the user who created the blog, by their object id which is stored in the user collection.
        ref: 'User', //refers to the User model.
    },
}, {timestamps: true});

const Blog = model('Blog', blogSchema);

module.exports = Blog;