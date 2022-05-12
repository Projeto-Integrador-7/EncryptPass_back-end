const router = require("express").Router();
const folderController = require('../controllers/folderController');
const authMiddleware = require("./middlewares/auth");

router.use('/', authMiddleware);

router.post("/:userId/create", async (req, res) => {      

    /*  #swagger.path = "/folder/{userId}/create"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/Folder' }
        }

        #swagger.tags = ["Folder"]
    */

    await folderController.create(req, res);
});

router.get("/find/:userId/:folderId", async (req, res) => {

    /*  #swagger.path = "/folder/find/{userId}/{folderId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Folder"]
    */
    await folderController.findOne(req, res);
});


router.get("/:userId/findAll", async (req, res) => {
    /*  #swagger.path = "/folder/{userId}/findAll"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Folder"]
    */

    await folderController.getAllFolders(req, res);
});

router.put("/:userId/update/:folderId", async (req, res) => {

    /*  #swagger.path = "/folder/{userId}/update/{folderId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }
        #swagger.parameters['body'] = {
            in: "body",
            required: true,
            schema: { $ref: '#/definitions/Folder' }
        }

        #swagger.tags = ["Folder"]
    */

    await folderController.updateFolder(req, res);
});

router.delete("/:userId/delete/:folderId", async(req, res) => {

    /*  #swagger.path = "/folder/{userId}/delete/{folderId}"
        #swagger.parameters['authorization'] = {
            in: "header",
            required: true,
            schema: {$ref: '#/definitions/Authorization'}
        }

        #swagger.tags = ["Folder"]
    */

    await folderController.deleteFolder(req, res);
});

module.exports = server => server.use('/folder', router);