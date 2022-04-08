const router = require("express").Router()
const userController = require('../controllers/userController')
const authMiddleware = require("./middlewares/auth")
const validEmail = require("./middlewares/validEmail")
const validPassForce = require("./middlewares/validPassForce")


router.use([/\/[0-9a-fA-F]{24}/, '/update'], authMiddleware)
router.use(['/create', '/update'], validPassForce)
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

router.put("/update/:userId", async (req, res) => {


    await userController.updateOne(req, res)

    /*  #swagger.path = "/user/{userId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["User"]
    */
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