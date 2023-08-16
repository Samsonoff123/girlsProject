const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const girlsRouter = require('./girlsRouter')

router.use('/user', userRouter)
router.use('/girls', girlsRouter)

module.exports = router