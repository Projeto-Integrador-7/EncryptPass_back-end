const router = require("express").Router()
const userController = require('../controllers/userController')
const authMiddleware = require("./middlewares/auth")
const validPassForce = require("./middlewares/validPassForce")

const privateRoutes = [
    '/findOne/:id/'
]

router.use(privateRoutes, authMiddleware)
router.use('/create', validPassForce)

router.post("/create", async (req, res) => {
    await userController.create(req, res)
})

router.get("/findOne/:id", async (req, res) => {
    await userController.findOne(req, res)
})

router.post("/login", async (req, res) => {
    await userController.login(req, res)
})

module.exports = server => server.use('/user', router);