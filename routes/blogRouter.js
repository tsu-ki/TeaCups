const express = require('express');
const multer = require('multer');
const router = express.Router();
const Blog = require('../models/blogSchema');
const Comment = require('../models/userComments');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({ //create a storage object with destination and filename properties.
  destination: function (req, file, cb) { //destination property is a function that takes the request, file, and callback function as arguments.
     const uploadPath = path.resolve(`./public/uploads/${req.user._id}`); //create a path to store the uploaded file.
    fs.mkdir(uploadPath, { recursive: true }, (err) => { //create a directory to store the uploaded file.
      if (err) {
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: function (req, file, cb) {
   const fileName = `${Date.now()}-${file.originalname}`; //create a unique filename using the current date and the original filename.
      cb(null, fileName); //store the file with the unique filename.
  }
});

const upload = multer({ storage: storage })

// Render blog page
router.get('/add-new', (req,res) => {
    res.render('addBlog', { user: res.locals.user, error: null });
});

router.get('/:id', async(req,res) =>{
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({BlogId: req.params.id}).populate('createdBy');
    return res.render('userBlog', { user: res.locals.user, blog, comments, error: null});
});

//Handle comment creation
router.post('/comment/:BlogId', async (req, res) =>{
 try {
     await Comment.create({
         content: req.body.content,
         createdBy: req.user._id,
         BlogId: req.params.BlogId
     });
     res.redirect(`/blog/${req.params.BlogId}`);  // Redirect to the blog page after creating a comment
    }catch (error) {
        console.error('Error creating comment:', error);
        const blog = await Blog.findById(req.params.BlogId).populate('createdBy');
  const comments = await Comment.find({BlogId: req.params.BlogId}).populate('createdBy');
    return res.render(`userBlog`, { user: res.locals.user, blog, comments, error: null});
 }
});

router.post('/', upload.single('coverImage') , async (req, res) => {
    try {
        const { title, content } = req.body;
        const coverImage = req.file ? req.file.filename : null;
        console.log('req.body:', req.body);
        const newBlog = new Blog({
            title,
            content,
            coverImageURL: coverImage,
            createdBy: res.locals.user._id
        });
        await newBlog.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).render('addBlog', { user: res.locals.user, error: 'An error occurred while creating the blog.' });
    }
});
module.exports = router;