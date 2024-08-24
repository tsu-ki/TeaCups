const express = require('express');
const User = require('../models/userModel');
const { generateToken } = require('../utility/authUtility');
const router = express.Router();

// Render signup page
router.get('/signup', (req,res) => {
    return res.render('signup', { user: res.locals.user, error: null});
})
// Render login page
router.get('/login', (req,res) => {
    return res.render('login', { user: res.locals.user, error: null });
});

// Handle user login
router.post('/login', async (req, res) => {
     try {
         const {email, password } = req.body;
         const user = await User.authenticate(email, password);
         if (user) {
             const token = generateToken(user);
              res.locals.user = user;
            // Redirect to homepage or dashboard after successful login
            return res.cookie('token', token).redirect('/');
        } else {
            // Handle authentication failure (e.g., incorrect credentials)
            return res.status(401).render('login', { error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('An error occurred during login.');
    }
});

router.get('/logout', (req,res) =>{
    res.clearCookie('token');
    res.redirect('/');
});
// Handle user signup
router.post('/signup', async (req,res) => {
    try {
        console.log('Received signup request with data:', req.body);
        const { firstName, lastName, email, password } = req.body;

        // Create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        // Redirect to homepage or login after signup
        return res.redirect('/');
    } catch (error) {
        console.error('Error during user signup:', error);
        return res.status(500).send('An error occurred during signup.');
    }
});


module.exports = router;