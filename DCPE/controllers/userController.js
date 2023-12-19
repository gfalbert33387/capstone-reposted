const User = require('../models/User'); // Assume you have a User model
const JobPrefsModel = require('../models/jobPrefs');


exports.login = async (req, res) => {
    // Check if user is already logged in
    if (req.session.userId) {
        req.flash('info', 'You are already logged in.');
        return res.redirect('/user/profile'); // Redirect them to their profile page
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(401).send('No user associated with that email.');
        }
        
        const passwordMatch = await user.comparePassword(req.body.password);
        if (!passwordMatch) {
            // Correctly handle error rendering
            req.flash('error', 'Password does not match.'); 
            return res.status(401).redirect('/user/login'); // Redirect to login page
        }

        // Assign user ID to session
        req.session.userId = user.id;
        console.log(req.session.userId)

        // Optionally, you can save the session to ensure it's stored in the database
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Error in session handling during login.');
            }
            res.redirect('/user/profile');
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login.');
    }
};


exports.signup = async (req, res) => {
    // Check if user is already logged in
    if (req.session.userId) {
      req.flash('info', 'You are already logged in and cannot create a new account.');
      return res.redirect('/user/profile'); // Redirect them to their profile page
    }
  
    try {
      // Check if a user with the given email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        req.flash('error', 'An account with that email already exists.');
        return res.redirect('/user/signup');
      }
      
      // Create a new user instance and save to the database
      const user = new User(req.body);
      await user.save();
  
      // Assign user ID to session
      req.session.userId = user.id; // Use userId to keep it consistent
  
      // Flash message and redirect to login for them to enter credentials
      req.flash('success', 'Account successfully created. Please log in.');
      res.redirect('/user/login');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 11000) {
        // This error code indicates a duplicate key error (e.g., a user with the same email already exists)
        req.flash('error', 'A user with that email already exists.');
        res.redirect('/user/signup');
      } else {
        // For any other errors, flash a general error message
        req.flash('error', 'Error signing up new user.');
        res.redirect('/user/signup');
      }
    }
  };
  

// ... other parts of the userController ...

exports.profile = async (req, res) => {
    // This should be req.session.userId based on how you set it in the login function
    console.log(req.session.userId)
    if (req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        if (!user) {
          req.flash('error', 'User not found.');
          return res.redirect('/user/login');
        }
        
        const jobPrefs = await JobPrefsModel.find({ user: user.id })
        if (jobPrefs) { 
          res.render('user/profile', { user: user, jobPrefs: jobPrefs });
        } else {
          res.render('user/profile', { user: user, jobPrefs: false });
        }

      } catch (error) {
        console.error('Error fetching user profile:', error);
        req.flash('error', 'An error occurred while fetching the profile.');
        res.redirect('/user/login');
      }
    } else {
      req.flash('error', 'Please log in to view your profile.');
      res.redirect('/user/login');
    }
  };
  
  // ... rest of the userController ...
  

// // In userController.js
// exports.updateProfile = async (req, res) => {
//     try {
//       // Assuming you have user ID stored in the session when they log in
//       const userId = req.session.userId;
//       const updates = req.body; // Contains the updated profile data from the form
//       // Update the user document in the database
//       await User.findByIdAndUpdate(userId, updates);
//       req.flash('success', 'Profile updated successfully.');
//       res.redirect('/user/profile');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       req.flash('error', 'An error occurred while updating the profile.');
//       res.redirect('/user/profile');
//     }
//   };
  
