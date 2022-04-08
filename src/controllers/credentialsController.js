const CredentialsModel = require('../models/credentialsModel')
const crypto = require('crypto-js')
const isUserAllowed = require('../utils/compareUserIdWithToken')

async function create(req, res) {

    const { body } = req
    const { userId } = req.params

    try {

        if(!isUserAllowed(userId, req.userId))
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const credentials = await CredentialsModel.create(body)

        credentials.password = crypto.AES.decrypt(credentials.password, process.env.ENCRYPT_SECRET).toString(crypto.enc.Utf8)

        return res.status(201).json({Sucesso: "A credencial foi criada com sucesso!", credentials})
        
    } catch (error) {
        
        return res.status(400).json({Erro: "Houve um erro!"})
    }

}

async function findOne(req, res) {

    const { userId, credentialsId } = req.params

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const credentials = await CredentialsModel.findById(credentialsId)

        if(!credentials) {
            return res.status(404).json({Erro: "A credencial não foi encontrada!"})
        }

        credentials.password = crypto.AES.decrypt(credentials.password, process.env.ENCRYPT_SECRET).toString(crypto.enc.Utf8)

        return res.status(200).json({Sucesso: "A credencial foi buscada com sucesso!", credentials})
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({Erro: "Houve um erro!"})
    }
}

async function updateOne(req, res) {

    const { body } = req
    const { userId, credentialsId } = req.params

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const updateRes = await CredentialsModel.updateOne({_id : credentialsId}, body)
        
        if(!updateRes.modifiedCount) {
            return res.status(404).json({Erro: "A credencial não foi encontrada!"})
        }

        const credentials = await CredentialsModel.findById(credentialsId)

        credentials.password = crypto.AES.decrypt(credentials.password, process.env.ENCRYPT_SECRET).toString(crypto.enc.Utf8)

        return res.status(200).json({Sucesso: "A credencial foi alterada com sucesso!", credentials})
        
    } catch (error) {
        
        return res.status(400).json({Erro: "Houve um erro!"})
    }

}

async function deleteOne(req, res) {

    const { userId, credentialsId } = req.params

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const deleteRes = await CredentialsModel.deleteOne({_id : credentialsId})

        if(!deleteRes.deletedCount) {
            return res.status(404).json({Erro: "A credencial não foi encontrada!"})
        }

        return res.status(200).json({Sucesso: "A credencial foi excluída com sucesso!"})
        
    } catch (error) {

        return res.status(400).json({Erro: "Houve um erro!"})
    }

}

module.exports = {
    create,
    findOne,
    updateOne,
    deleteOne
}