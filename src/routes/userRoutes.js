const router = require("express").Router()
const userController = require('../controllers/userController')
const authMiddleware = require("./middlewares/auth")
const validEmail = require("./middlewares/validEmail")
const validPassForce = require("./middlewares/validPassForce")


const privateRoutes = [
    '/:userId'
]

router.use(privateRoutes, authMiddleware)
router.use('/create', validPassForce)
router.use(['/create', '/login'], validEmail)

router.post("/create", async (req, res) => {

    /*  #swagger.path = "/user/create"
        #swagger.tags = ["User"]
    */

    await userController.create(req, res)
})

router.get("/:userId", async (req, res) => {

    /*  #swagger.path = "/user/{userId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["User"]
    */

    await userController.findOne(req, res)
})

router.post("/login", async (req, res) => {

    //  #swagger.path = "/user/login"
    //  #swagger.tags = ["User"]

    await userController.login(req, res)
})

router.put("/:userId", async (req, res) => {

    /*  #swagger.path = "/user/{userId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["User"]
    */

    await userController.update(req, res)
})

router.delete("/:userId", async (req, res) => {

    /*  #swagger.path = "/user/{userId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["User"]
    */

    await userController.delete(req, res)
})

module.exports = server => server.use('/user', router);