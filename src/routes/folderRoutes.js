const router = require("express").Router();
const folderController = require('../controllers/folderController');

router.get("/:folderId", async (req, res) => {

    /*  #swagger.path = "/folder/{folderId}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */
    await folderController.findOne(req, res);
});

router.post("/createFolder", async (req, res) => {

    //  #swagger.path = "/folder/createFolder"
    //  #swagger.tags = ["Folder"]

    await folderController.createFolder(req, res);
});

router.get("/", async (req, res) => {
    //  #swagger.path = "/folder/getAllFolders"
    //  #swagger.tags = ["Folder"]

    await folderController.getAllFolders(req, res);
});

router.put("/:id", async (req, res) => {

    /*  #swagger.path = "/folder/{updateFolder}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */

        await folderController.updateFolder(req, res);
});

router.delete("/:id", async(req, res) => {

    /*  #swagger.path = "/folder/{deleteFolder}"
        #swagger.parameters['Authorization'] = {
        in: "header",
        required: true
    } 
        #swagger.tags = ["Folder"]
    */

    await folderController.deleteFolder(req, res);
});

module.exports = server => server.use('/folder', router);