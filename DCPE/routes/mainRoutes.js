const myExpress = require('express')
const thisController = require('../controllers/mainController')

const thisRouter = myExpress.Router()

// GET /index
thisRouter.get(['/', '/home', '/main', '/index'], thisController.index)

// GET /about
thisRouter.get(['/about', '/aboutus', '/about_us', '/about-us'], thisController.about)

// GET /contact
thisRouter.get(['/contact', '/contactus', '/contact_us', '/contact-us'], thisController.contact)

/* In Node.js, "module.exports" exposes the functionality 
of this "module" to any module that imports it via the "requires()" method.*/
module.exports = thisRouter
