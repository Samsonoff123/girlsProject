const Router = require('express')
const router = new Router()
const girlsController = require('../controllers/girlsController')

router.get('/parse', girlsController.parse)
router.get('/getByAge', girlsController.getByAge)
router.get('/getByWeight', girlsController.getByWeight)
router.get('/getByHeight', girlsController.getByHeight)

router.get('/', girlsController.getAll)
router.get('/:id', girlsController.getOne)


module.exports = router