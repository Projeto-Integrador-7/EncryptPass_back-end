const FolderModel = require('../models/folderModel');
const isUserAllowed = require('../utils/compareUserIdWithToken');

async function create(req, res) { 
    const body = req.body;
    const { userId } = req.params;

    try {
        const verificarSeExistePasta = await FolderModel.findOne({ title: { $eq: body.title}} && {userId: { $eq: body.userId }});
        if (verificarSeExistePasta) {
            return res.status(400).json({ Erro: "Já existe uma pasta criada com ese nome!" });
        }

        const folder = await FolderModel.create(
            {
                title: body.title,
                description: body.description,
                userId: userId
            }
        );
        return res.status(201).json({ Sucesso: "Nova pasta criada com sucesso.", folder });

    } catch (error) {
        return res.status(400).json({ Erro: "Requisição Inválida." });
    }
}

async function findOne(req, res) {
    const { folderId, userId } = req.params;
    try {
        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possui acesso ao recurso!" });

        const folder = await FolderModel.findById(folderId);
        if (!folder)
            return res.status(400).json({ Erro: "Pasta não encontrada." })

        return res.status(200).json({ Sucesso: "Pasta encontrada.", folder });
    } catch (error) {
        return res.status(400).json({ Erro: "Requisição Inválida." });
    }
}

async function getAllFolders(req, res) {
    const { folderId } = req.params;
    const { userId } = req.params;
    try {
        const folders = await FolderModel.find({ folderId: folderId, userId: userId });
        return res.status(200).json(folders);
    } catch (error) {
        return res.status(400).json({ Erro: "Requisição Inválida." });
    }
}

async function deleteFolder(req, res) {
    const { userId, folderId } = req.params;
    try {
        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possui acesso ao recurso!" });

        const deleteRes = await FolderModel.deleteOne({ _id: folderId, userId: userId });
        if (!deleteRes.deletedCount)
            return res.status(404).json({ Erro: "A pasta não foi encontrada!" });

        return res.status(200).json({ Sucesso: "Pasta excluída com sucesso!" });
    } catch (error) {
        return res.status(400).json({ Erro: "Requisição Inválida." });
    }
}

async function updateFolder(req, res) {
    const { body } = req;
    const { userId, folderId } = req.params;
    try {
        if (!isUserAllowed(userId, req.userId)) {
            return res.status(403).json({ Erro: "O usuário não possui acesso ao recurso!" });
        }
        
        const updateRes = await FolderModel.updateOne({ _id: { $eq: folderId } },
            {
                title: body.title,
                description: body.description,
                userId: userId
            });

        if (!updateRes.modifiedCount)
            return res.status(404).json({ Erro: "A pasta não foi encontrada!" });

        const folder = await FolderModel.findById(folderId);
        return res.status(200).json({ Sucesso: "Pasta alterada com sucesso!", folder });
    } catch (error) {
        return res.status(400).json({ Erro: "Requisição Inválida." });
    }
}

module.exports = {
    create,
    findOne,
    getAllFolders,
    deleteFolder,
    updateFolder
}