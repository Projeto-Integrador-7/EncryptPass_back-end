const { sign } = require("jsonwebtoken")
const { compare } = require('bcrypt')
const dayjs = require('dayjs')

const UserModel = require('../models/userModel')
const isUserAllowed = require('../utils/compareUserIdWithToken')
const createRefreshToken = require('../utils/createRefreshToken')
const { find } = require("../models/userModel")

function generateToken(id) {

    const token = sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "20s"
    })

    return token;
}

async function create(req, res) {

    const { body } = req

    try {

        const registeredUser = await UserModel.findOne({ email: body.email })
        if (registeredUser) {
            return res.status(409).json({ Erro: "O email fornecido já está cadastrado!" })
        }

        const user = await UserModel.create(body)
        const token = generateToken(user._id)
        return res.status(201).json({ Sucesso: "O usuário foi criado com sucesso!", user, token })

    } catch (error) {

        return res.status(400).json({ Erro: "Houve um erro!" })

    }
}

async function findOne(req, res) {

    const { userId } = req.params

    try {

        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possuí acesso ao recurso!" })

        const user = await UserModel.findById(userId)

        if (!user)
            return res.status(404).json({ Erro: "O usuário não foi encontrado!" })

        return res.status(200).json({ Sucesso: "O usuário foi buscado com sucesso!", user })

    } catch (error) {
        return res.status(400).json({ Erro: "Houve um erro!" })
    }
}

async function refreshToken(req, res) {

    const { refreshToken } = req.body

    if (!refreshToken)
        return res.status(400).json({Erro: "O campo 'refreshToken' não foi fornecido!"})

    try {

        const user = await UserModel.findOne({ "refreshToken._id": refreshToken })

        if (!user)
            return res.status(401).json({ Erro: "O refresh token não foi encontrado!" })

        const isRefreshTokenExpired = dayjs().isAfter(dayjs.unix(user.refreshToken.expiresIn))

        if (isRefreshTokenExpired) {
            return res.status(401).json({ Erro: "O refresh token está expirado!" })
        }

        const token = generateToken(user._id)

        await createRefreshToken(user.id)

        const userWithNewRefreshToken = await UserModel.findById(user.id)
        const newRefreshToken = userWithNewRefreshToken.refreshToken

        return res.status(200).json(
            {
                Sucesso: "O token e o refresh token foram alterados com sucesso!",
                newRefreshToken, 
                token
            }
        )


    } catch (error) {

        return res.status(400).json({ Erro: "Houve um erro!" })
    }
}

async function login(req, res) {
    const { email, password } = req.body

    try {

        const user = await UserModel.findOne({
            email: email
        }).select("+password")

        if (!user) {
            return res.status(404).json({ Erro: "Os dados fornecidos não são válidos!" });
        }

        const result = await compare(password, user.password)

        if (result) {
            user.password = undefined;
            const token = generateToken(user._id)

            await createRefreshToken(user.id)

            const userWithRefreshToken = await UserModel.findById(user.id)

            return res.status(200).json({ Sucesso: "O login foi efetuado com sucesso!", userWithRefreshToken, token })
        }

        return res.status(400).json({ Erro: "Os dados fornecidos não são válidos!" });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ Erro: "Houve um erro!" });
    }
}

async function updateOne(req, res) {

    const { userId } = req.params
    const { body } = req

    try {

        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possuí acesso ao recurso!" })

        const updateRes = await UserModel.updateOne({ _id: userId }, body)

        if (!updateRes.modifiedCount) {
            return res.status(404).json({ Erro: "O usuário não foi encontrado!" })
        }

        const user = await UserModel.findById(userId)

        return res.status(200).json({ Sucesso: "O usuário foi alterado com sucesso!", user });

    } catch (error) {
        return res.status(400).json({ Erro: "Houve um erro!" });
    }
}

async function deleteOne(req, res) {

    const { userId } = req.params

    try {

        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possuí acesso ao recurso!" })

        const deleteRes = await UserModel.deleteOne({ _id: userId })

        if (!deleteRes.deletedCount) {
            return res.status(404).json({ Erro: "O usuário não foi encontrado!" })
        }

        return res.status(200).json({ Sucesso: "A usuário foi excluído com sucesso!" })

    } catch (error) {
        return res.status(400).json({ Erro: "Houve um erro!" });
    }
}

module.exports = {
    create,
    findOne,
    refreshToken,
    login,
    updateOne,
    deleteOne
}