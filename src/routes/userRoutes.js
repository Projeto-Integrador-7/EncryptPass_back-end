const router = require("express").Router()
const userController = require('../controllers/userController')

router.post("/create", async (req, res) => {
    await userController.create(req, res)
})

router.get("/findOne/:id", async (req, res) => {
    await userController.findOne(req, res)
})

module.exports = server => server.use('/user', router);