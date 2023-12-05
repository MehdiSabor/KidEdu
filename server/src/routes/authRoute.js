const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route for Google authentication
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] ,
    session: false}));

// Callback route after successful Google authentication
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' , session: false}),
  (req, res) => {
      const htmlWithEmbeddedJs = `
        <html>
          <head>
            <title>Authentication Success</title>
            <p>{ token: "${req.user.token}" } <p>
          <body>
          </head>
          <body>
            <script type="text/javascript">
              // Send token to React Native WebView
              window.ReactNativeWebView.postMessage(JSON.stringify({ token: "${req.user.token}" }));
            </script>
          </body>
        </html>`;
      res.send(htmlWithEmbeddedJs);
  });


module.exports = router;
