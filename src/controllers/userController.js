const UserModel = require('../models/userModel')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

function generateToken(id) {

    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: 3600
    })

    return token;
}

async function create(req, res) { 

    const { body } = req

    try {

        const registeredUser = await UserModel.findOne({email: body.email})
        if (registeredUser) {
            return res.status(400).json({Erro: "O email fornecido já está cadastrado!"})
        }

        const user = await UserModel.create(body)
        return res.status(201).json({Sucesso: "Usuário criado", user})

    } catch (error) {

        return res.status(400).json({Erro: "Requisição Inválida"})

    }
}

async function findOne(req, res) {    
    const { id } = req.params
    try {
        const user = await UserModel.findById(id)
        return res.status(200).json(user)
    } catch (error) {
        return res.json(error)
    }
}

async function login(req, res) {    
    const { email, password } = req.body

    try {

        const user = await UserModel.findOne({
            email: email
        }).select("+password")

        if(!user) {
            return res.status(400).json({ Erro: "O email fornecido não foi encontrado!"});
        }

        const result = await bcrypt.compare(password, user.password)

        if(result) {

            user.password = undefined;
            const token = generateToken(user._id)
            return res.status(200).json({user, token})
        }

        return res.status(400).json({Erro: "A senha fornecida não é válida!"});
        
    } catch (err) {
        return res.status(400).json({Erro: "Requisição Inválida"});
    }
}

module.exports = {
    create,
    findOne,
    login
}