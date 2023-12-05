const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');
require('dotenv').config();



passport.use(new GoogleStrategy({
    clientID: '697839643431-p9s1jmrn11v7ump26mi60mf76jmao59g.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'https://9448-197-146-63-142.ngrok-free.app/auth/google/callback'

}, async (accessToken, refreshToken, profile, done) => {
    // Check if parent exists in DB
    let parent = await prisma.parent.findUnique({ where: { email: profile.emails[0].value } });
    
    if (!parent) {
        // If not, create a new Parent entry
        parent = await prisma.parent.create({
            data: {
                email: profile.emails[0].value,
                name: profile.displayName,
            }
        });
    }

    // Generate a JWT token for the parent
    const token = jwt.sign({ parentId: parent.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
    return done(null, { parent, token });
}));
