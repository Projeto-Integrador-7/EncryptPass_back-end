const router = require('express').Router()
const credentialsController = require('../controllers/credentialsController')
const authMiddleware = require("./middlewares/auth")

router.use('/', authMiddleware)

router.post('/:userId/create', async (req, res) => {

    await credentialsController.create(req,res)

    /*  #swagger.path = "/credentials/{userId}/create"
        #swagger.parameters['Authorization'] = {
            in: "header",
            required: true
        #swagger.tags = ["Credentials"]
    */

})

router.get('/:userId/:credentialsId', async (req, res) => {

    await credentialsController.findOne(req,res)

    /*  #swagger.path = "/credentials/{userId}/{credentialsId}"
        #swagger.parameters['Authorization'] = {
            in: "header",
            required: true
        #swagger.tags = ["Credentials"]
    */

})

router.get('/:userId/findAll', async (req, res) => {

    /*  #swagger.path = "/credentials/{userId}/findAll"
        #swagger.parameters['Authorization'] = {
            in: "header",
            required: true
        #swagger.tags = ["Credentials"]
    */

})

router.put('/:userId/:credentialsId', async (req, res) => {

    await credentialsController.updateOne(req,res)


    /*  #swagger.path = "/credentials/{userId}/{credentialsId}"
        #swagger.parameters['Authorization'] = {
            in: "header",
            required: true
        #swagger.tags = ["Credentials"]
    */

})

router.delete('/:userId/:credentialsId', async (req, res) => {

    await credentialsController.deleteOne(req,res)

    /*  #swagger.path = "/credentials/{userId}/{credentialsId}"
        #swagger.parameters['Authorization'] = {
            in: "header",
            required: true
        #swagger.tags = ["Credentials"]
    */

})

module.exports = server => server.use('/credentials', router)
