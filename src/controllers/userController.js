const UserModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const isUserAllowed = require('../utils/compareUserIdWithToken')

function generateToken(id) {

    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: 86400
    })

    return token;
}

async function create(req, res) { 

    const {body} = req

    try {

        const registeredUser = await UserModel.findOne({email: body.email})
        if (registeredUser) {
            return res.status(409).json({Erro: "O email fornecido já está cadastrado!"})
        }

        const user = await UserModel.create(body)
        const token = generateToken(user._id)
        return res.status(201).json({Sucesso: "O usuário foi criado com sucesso!", user, token})

    } catch (error) {

        return res.status(400).json({Erro: "Houve um erro!"})

    }
}

async function findOne(req, res) { 

    const {userId} = req.params

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const user = await UserModel.findById(userId)

        return res.status(200).json({Sucesso: "O usuário foi buscado com sucesso!", user})

    } catch (error) {
        return res.status(400).json({Erro: "Houve um erro!"})
    }
}

async function login(req, res) {    
    const { email, password } = req.body

    try {

        const user = await UserModel.findOne({
            email: email
        }).select("+password")

        if(!user) {
            return res.status(404).json({ Erro: "O email fornecido não foi encontrado!"});
        }

        const result = await bcrypt.compare(password, user.password)

        if(result) {
            user.password = undefined;
            const token = generateToken(user._id)
            return res.status(200).json({ Sucesso: "O login foi efetuado com sucesso!", user, token})
        }

        return res.status(400).json({Erro: "A senha fornecida não é válida!"});
        
    } catch (error) {
        return res.status(400).json({Erro: "Houve um erro!"});
    }
}

async function updateOne(req, res) {    

    const { userId } = req.params
    const { body } = req

    try {

        if(!isUserAllowed(userId, req.userId)) 
            return res.status(403).json({Erro: "O usuário não possuí acesso ao recurso!"})

        const updateRes = await UserModel.updateOne({_id: userId}, body)

        if(!updateRes.modifiedCount) {
            return res.status(404).json({Erro: "O usuário não foi encontrado!"})
        }

        const user = await UserModel.findById(userId)

        return res.status(200).json({Sucesso: "O usuário foi alterado com sucesso!", user});
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({Erro: "Houve um erro!"});
    }
}

module.exports = {
    create,
    findOne,
    login,
    updateOne
}