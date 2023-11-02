const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route for Google authentication
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] ,
    session: false}));

// Callback route after successful Google authentication
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' ,
    session: false}),
    (req, res) => {
        // Successful authentication, send JWT token.
        res.json({ token: req.user.token });
    });

module.exports = router;
