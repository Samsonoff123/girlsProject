const Router = require('express')
const router = new Router()
const girlsController = require('../controllers/girlsController')

router.get('/', girlsController.parse)


module.exports = router