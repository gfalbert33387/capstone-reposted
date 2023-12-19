const myExpress = require('express')
const userController = require('../controllers/userController')

const thisRouter = myExpress.Router()

// GET request to serve the login form
thisRouter.get('/login', (req, res) => res.render('user/login')); // Path updated to 'user/login'

// POST request to process the login form submission
thisRouter.post('/login', userController.login);

// GET request to serve the user profile page
thisRouter.get('/profile',  userController.profile);

thisRouter.post('/profile', userController.profile);

// GET request to serve the signup form
thisRouter.get('/signup', (req, res) => res.render('user/signup')); // Path updated to 'user/signup'

// POST request to process the signup form submission
thisRouter.post('/signup', userController.signup);

// // In your userRoutes.js
// thisRouter.post('/update-profile', userController.updateProfile);



// Logout route
thisRouter.get('/logout', (req, res) => {
    console.log('Attempting to log out');
    if (req.session) {
      console.log('Session exists, destroying session');
      req.session.destroy(err => {
        if (err) {
          console.error('Error during logout:', err);
          return res.status(500).send('An error occurred during logout.');
        }
        console.log('Session destroyed, redirecting to login');
        res.redirect('/user/login');
      });
    } else {
      console.log('No session exists, redirecting to login');
      res.redirect('/user/login');
    }
  });


// Exposes module functionality to any file using `require(userRoutes)`
module.exports = thisRouter

