const router = require("express").Router();
const folderController = require('../controllers/folderController');
const authMiddleware = require("./middlewares/auth");

router.use('/', authMiddleware);

router.get("/find/:userId/:folderId", async (req, res) => {

    /*  #swagger.path = "/folder/find/{userId}/{folderId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */
    await folderController.findOne(req, res);
});

router.post("/:userId/create", async (req, res) => {      

    //  #swagger.path = "/folder/{userId}/create"
    //  #swagger.tags = ["Folder"]

    await folderController.create(req, res);
});

router.get("/:userId/findAll", async (req, res) => {
    //  #swagger.path = "/folder/{userId}/findAll"
    //  #swagger.tags = ["Folder"]

    await folderController.getAllFolders(req, res);
});

router.put("/:userId/update/:folderId", async (req, res) => {

    /*  #swagger.path = "/folder/{userId}/update/{userId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */

    await folderController.updateFolder(req, res);
});

router.delete("/:userId/delete/:folderId", async(req, res) => {

    /*  #swagger.path = "/folder/{userId}/delete/{folderId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */

    await folderController.deleteFolder(req, res);
});

module.exports = server => server.use('/folder', router);