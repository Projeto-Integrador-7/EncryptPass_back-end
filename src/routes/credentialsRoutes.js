const router = require('express').Router()
const credentialsController = require('../controllers/credentialsController')
const authMiddleware = require("./middlewares/auth")

router.use('/', authMiddleware)

router.post('/:userId/create', async (req, res) => {

    await credentialsController.create(req,res)

    /*  #swagger.path = "/credentials/{userId}/create"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/Credentials' }
        }

        #swagger.tags = ["Credentials"]
    */

})

router.get('/:userId/find/:credentialsId', async (req, res) => {

    await credentialsController.findOne(req,res)

    /*  #swagger.path = "/credentials/{userId}/find/{credentialsId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Credentials"]
    */

})

router.get('/:userId/findAll', async (req, res) => {

    /*  #swagger.path = "/credentials/{userId}/findAll"
       #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Credentials"]
    */

    await credentialsController.findAll(req, res)

})

router.get('/:userId/:folderId', async (req, res) => {

    /*  #swagger.path = "/credentials/{userId}/{folderId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Credentials"]
    */

    await credentialsController.findAllByFolder(req, res)

})

router.put('/:userId/update/:credentialsId', async (req, res) => {

    await credentialsController.updateOne(req,res)


    /*  #swagger.path = "/credentials/{userId}/update/{credentialsId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/Credentials' }
        }

        #swagger.tags = ["Credentials"]
    */

})

router.delete('/:userId/delete/:credentialsId', async (req, res) => {

    await credentialsController.deleteOne(req,res)

    /*  #swagger.path = "/credentials/{userId}/delete/{credentialsId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        
        #swagger.tags = ["Credentials"]
    */

})

module.exports = server => server.use('/credentials', router)
