const FolderModel = require('../models/folderModel');

async function createFolder(req, res) { 
    const body = req.body
    try {
        const verificarFolder = await FolderModel.findOne({ folder: body.folder });
        if (verificarFolder) return res.status(400).json({Erro: "Já existe uma pasta criada com ese nome!"});

        const folder = await FolderModel.create(body);
        return res.status(201).json({Sucesso: "Nova pasta criada com sucesso.", folder})

    } catch (error) {
        return res.status(400).json({Erro: "Requisição Inválida."});
    }
}

async function findOne(req, res) { 
    try {
        const { title } = req.params;
        if(req.title != title) 
            return res.status(400).json({Erro: "Pasta não encontrada."})
            
        const titleFolder = await FolderModel.findNameByTitle(title);
        return res.status(200).json(titleFolder);

    } catch (error) {
        return res.status(400).json({Erro: "Requisição Inválida."});
    }
}

async function getAllFolders(req, res) {
    try {
        const folders = await FolderModel.find();
        return res.status(200).json(folders);
    } catch (error) {
        return res.status(400).json({Erro: "Requisição Inválida."});
    }
}

async function deleteFolder(req, res) {
    try {
        const body = req.body;
        
        const deleteFolder = await FolderModel.deleteOne({ id: body.folder });
        if(deleteFolder instanceof Error) 
            return res.status(400).json(deleteFolder);
    } catch (error) {
        return res.status(400).json({Erro: "Requisição Inválida."});
    }
}

async function updateFolder(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        await FolderModel.updateOne({ id: id, title: title, description: description });
        const folder = await FolderModel.findOne({ _id: id });
        return res.status(200).json(folder);       
    } catch (error) {
        return res.status(400).json({Erro: "Requisição Inválida."});
    }
}

module.exports = {
    createFolder,
    findOne,
    getAllFolders,
    deleteFolder,
    updateFolder
}