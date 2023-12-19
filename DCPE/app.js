const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const session = require('express-session');
require('dotenv').config();


const app = express();
const mongoUri = process.env.MONGODB_URI;

// Server Listening Configuration
const port = process.env.PORT || 8081; // Fallback to 8081 if PORT is not set in environment

// Connect to MongoDB database
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  // Start the server
  app.listen(port, () => {
    console.log('Server is running on port', port);
  });
}).catch(err => console.log(err.message));

// Session Configuration
app.use(session({
  secret: "adsda87sdah9dhasdbn392as", // Use an environment variable for your secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUri
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(flash());

// Flash Message Middleware
app.use(flash());

// Middleware to make user's name available to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null; // Use currentUser here
  res.locals.userId = req.session.userId
  res.locals.flashMessages = req.flash();
  next();
});

// ... other middleware ...

// app.use((req, res, next) => {
//   if (req.session.userId) {
//     User.findById(req.session.userId, (err, user) => {
//       if (!err && user) {
//         res.locals.user = user;
//         next();
//       } else {
//         // Handle error or set res.locals.user to null
//         next(err);
//       }
//     });
//   } else {
//     res.locals.user = null;
//     next();
//   }
// });

// ... routes and other middleware ...


// Static Files and View Engine
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware
const morgan = require('morgan');
const methodOverride = require('method-override');

app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// Routes
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobPrefsRoutes = require('./routes/jobPrefsRoutes');
const testingRoutes = require('./routes/testingRoutes');

app.use('/', mainRoutes);
app.use('/user', userRoutes);
app.use('/feedback', resumeRoutes);
app.use('/jobs', jobRoutes);
app.use('/job-prefs', jobPrefsRoutes);
app.use('/testing', testingRoutes);

// Error Handling for 404 Not Found
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// General Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging

  // Set error message and status if not set
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Respond with error page
  res.status(status).render('error', {
    error: { status, message }
  });
});