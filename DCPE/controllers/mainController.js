//  Controller sends response file relative to views folder, ex: res.render('./main/index')

// Sends HTTP response to user with rendered "index" page when requested by mainRoutes
exports.index = (req, res) => { res.render('./main/index') }

// Sends HTTP response to user with rendered "about" page when requested by mainRoutes
exports.about = (req, res) => { res.render('./main/about') }

// Sends HTTP response to user with rendered "contact" page when requested by mainRoutes
exports.contact = (req, res) => { res.render('./main/contact') }

// Sends HTTP response to user with rendered "login" page when requested by mainRoutes
exports.login = (req, res)=>{   res.render('./main/login')   }

// Sends HTTP response to user with rendered "profile" page when requested by mainRoutes
exports.profile = (req, res)=>{   res.render('./main/profile')   }


