const router = require("express").Router()
const userController = require('../controllers/userController')
const authMiddleware = require("./middlewares/auth")
const validEmail = require("./middlewares/validEmail")
const validPassForce = require("./middlewares/validPassForce")

router.use(['/update', '/delete', '/find'], authMiddleware)
router.use(['/create', '/update,', '/reset_password', '/reset_expire_password'], validPassForce)
router.use(['/create', '/login'], validEmail)

router.post("/create", async (req, res) => {

    /*  #swagger.path = "/user/create"
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/User' }
        }

        #swagger.tags = ["User"]
    */

    await userController.create(req, res)
})

router.get("/find/:userId", async (req, res) => {

    /*  #swagger.path = "/user/find/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        } 

        #swagger.tags = ["User"]
    */

    await userController.findOne(req, res)
})

router.post("/refreshToken", async (req, res) => {

    /*  #swagger.path = "/user/refreshToken"
        #swagger.parameters['refreshToken'] = {
            in: "body",
            required: true,
            schema: {$ref: '#/definitions/Refreshtoken'}
        } 

        #swagger.tags = ["User"]
    */

    await userController.refreshToken(req, res)
})

router.post("/login", async (req, res) => {

    /*  #swagger.path = "/user/login"
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/Login' }
        }

        #swagger.tags = ["User"]
    */

    await userController.login(req, res)
})

router.put("/update/:userId", async (req, res) => {

    /*  #swagger.path = "/user/update/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/User' }
        }

        #swagger.tags = ["User"]
    */

    await userController.updateOne(req, res)

})

router.delete("/delete/:userId", async (req, res) => {

    /*  #swagger.path = "/user/delete/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["User"]
    */

    await userController.deleteOne(req, res)
})

router.post("/forgot_password_email/:userId", async (req, res) => {
    /*  #swagger.path = "/user/forgot_password_email/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["User"]
    */

    await userController.forgotPassword(req, res);
})

router.post("/reset_forgot_password/:userId", async (req, res) => {
    /*  #swagger.path = "/user/reset_forgot_password/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["User"]
    */

    await userController.resetForgotPassword(req, res);
})

router.post("/expire_password_email/:userId", async (req, res) => {
    /*  #swagger.path = "/user/reset_password_email/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["User"]
    */

    await userController.resetPasswordSendMail(req, res);
})

router.post("/reset_expire_password/:userId", async (req, res) => {
    /*  #swagger.path = "/user/reset_expire_password/{userId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["User"]
    */

    await userController.resetExpirePassword(req, res);
})

module.exports = server => server.use('/user', router);