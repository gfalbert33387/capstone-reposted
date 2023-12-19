const myExpress = require('express')
const thisController = require('../controllers/jobController')
const thisRouter = myExpress.Router()

// GET /Items --> display list of all unfiltered Items to /jobs
thisRouter.get('/', thisController.getAll)

// GET /Items/:id --> display list of all Items matching the query details in id
thisRouter.get('/:id', thisController.getFiltered)

// GET /Items --> display list of all unfiltered Items to testing/Greg
//thisRouter.get('/testAll', thisController.testAll)

// GET /Items --> display list of all unfiltered Items to testing/Greg
//thisRouter.get('/testFiltered', thisController.testFiltered)

module.exports = thisRouter