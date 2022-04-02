const CredentialsModel = require('../models/credentialsModel')
const crypto = require('crypto-js')
const isUserAllowed = require('../utils/compareUserIdWithToken')

async function create(req, res) {

    const { body } = req
    const { userId } = req.params

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(400).json({Erro: "O 'id' fornecido não é acessível!"})

        const credentials = await CredentialsModel.create(body)

        credentials.password = crypto.AES.decrypt(credentials.password, process.env.ENCRYPT_SECRET).toString(crypto.enc.Utf8)

        return res.status(201).json({Sucesso: "Credencial criada", credentials})
        
    } catch (error) {
        
        return res.status(400).json({Erro: "Requisição Inválida"})
    }

}

module.exports = {
    create
}
