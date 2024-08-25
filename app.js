require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const blogRoute = require('./routes/blogRouter');
const mongoose = require('mongoose');
const {verifyAuthentication} = require("./middlewares/authMiddleware");
const Blog = require('./models/blogSchema');

const app = express();
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() =>console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//middleware functions
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(verifyAuthentication('token'));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
//user routes
app.use('/user', userRouter);
app.use('/blog', blogRoute);

app.use('/uploads', express.static(path.resolve('./public/uploads')));
app.use('/profile', express.static(path.resolve('./public/profile')));

// Home route
app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({}).populate('createdBy').sort({createdAt: 'desc'});
    res.render('home',
        { error: null,
            user: res.locals.user,
            blogs: allBlogs
        });
});

// Login route
app.get('/user/login', (req, res) => {
    res.render('login', { error: null, user: res.locals.user });
});

app.listen(port, () =>
    console.log('Server Running at port:', port));
