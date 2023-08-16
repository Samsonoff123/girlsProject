const Router = require('express')
const router = new Router()
const girlsController = require('../controllers/girlsController')

router.get('/parse', girlsController.parse)
router.get('/', girlsController.getAll)
router.get('/getByAge', girlsController.getByAge)

module.exports = router