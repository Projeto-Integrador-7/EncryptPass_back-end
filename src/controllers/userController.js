const { sign } = require("jsonwebtoken")
const { compare } = require('bcrypt')
const dayjs = require('dayjs')
const mailer = require('../modules/mailer')
const crypto = require('crypto-js')

const UserModel = require('../models/userModel')
const isUserAllowed = require('../utils/compareUserIdWithToken')
const createRefreshToken = require('../utils/createRefreshToken')
const { find } = require("../models/userModel")
const { send } = require("express/lib/response")

function generateToken(id) {

    const token = sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "72h"
    })

    return token;
}

async function create(req, res) {

    const { body } = req

    try {

        const registeredUser = await UserModel.findOne({ email: {$eq: body.email}})
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

        const user = await UserModel.findOne({ "refreshToken._id": { $eq : refreshToken }})

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
            email: { $eq: email}
        }).select("+password")

        if (!user) {
            return res.status(404).json({ Erro: "Os dados fornecidos não são válidos!" });
        }
        const now  = new Date()
        user.expirePassword.setDate(user.expirePassword.getDate() + 30);
        if (now > user.expirePassword){
            return res.status(400).json({Erro: "Senha expirada, favor criar uma nova diferente da última utilizada!"});
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
        return res.status(400).json({ Erro: "Houve um erro!" });
    }
}

async function updateOne(req, res) {

    const { userId } = req.params
    const { body } = req

    try {

        if (!isUserAllowed(userId, req.userId))
            return res.status(403).json({ Erro: "O usuário não possui acesso ao recurso!" })

        const updateRes = await UserModel.updateOne({ _id: { $eq :userId }}, body)

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

async function forgotPassword(req, res) {
    const { email } = req.body;
    try {

        const user = await UserModel.findOne({ email });
        if(!user) {
            return res.status(400).send({ error: "Usuário não encontrado." });
        }

        const token = generateToken(user._id);
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await UserModel.findByIdAndUpdate(user.id, {
            '$set': {
                'passwordResetToken': token,
                'passwordResetExpires': now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'projetopivii@gmail.com',
            subject: 'Alteração de senha',
            template: 'user/forgot_password',
            context: { token }
        }, (error) => {
            if(error){
                return res.status(400).send({ error: "Não foi possível enviar o e-mail para redifinição de senha." });
            }
            return res.send();
        })
    } catch (error) {
        res.status(400).send({error: 'Houve um erro'});
    }
}

async function resetForgotPassword(req, res) {
    const { email, token, password, passwordReminderTip} = req.body;
    try {
        const user = await UserModel.findOne({ email }).select('+passwordResetToken passwordResetExpires');

        if(!user){
            return res.status(400).send({ error: "Usuário não encontrado" });
        }

        if(token !== user.passwordResetToken) {
            return res.status(400).send({ error: "Token inválido." });
        }

        const now = new Date();
        if(now > user.passwordResetExpires){
            return res.status(400).send({ error: "Token expirado, gere um novo." });
        }

        user.password = password;
        user.passwordReminderTip = passwordReminderTip;
        user.expirePassword = now;
        await user.save();
        res.status(200).send({sucesso: "Senha redefinida com sucesso."});
        
    } catch (error) {
        res.status(400).send({error: 'Houve um erro'});
    }
}

async function resetPasswordSendMail(req, res) {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if(!user) {
            return res.status(400).send({ error: "Usuário não encontrado." });
        }

        const token = generateToken(user._id);
        const now = new Date();
        now.getMinutes(now.setMinutes() + 15);

        await UserModel.findByIdAndUpdate(user.id, {
            '$set': {
                'passwordResetToken': token,
                'passwordResetExpires': now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'projetopivii@gmail.com',
            subject: 'Redefinição de senha',
            template: 'user/reset_password',
            context: { token }
        }, (error) => {
            if(error){
                return res.status(400).send({ error: "Não foi possível enviar o e-mail para redifinição de senha." });
            }
            return res.send();
        })
    } catch (error) {
        res.status(400).send({error: 'Houve um erro'});
    }
}

async function resetExpirePassword(req, res){
    const { userId } = req.params;
    const { email, token, password, passwordReminderTip} = req.body;


    try {
        const user = await UserModel.findOne({ email }).select('+password passwordResetToken passwordResetExpires');
        if(!user){
            return res.status(400).json({ Erro: "Usuário não encontrado." });
        }

        if(token !== user.passwordResetToken) {
            return res.status(400).send({ error: "Token inválido." });
        }

        const now = new Date();
        if(now > user.passwordResetExpires){
            return res.status(400).send({ error: "Token expirado, gere um novo." });
        }

        const equalPass = await compare(password, user.password);
        if(equalPass){
            return res.status(400).json({ Erro: "A senha não pode ser a mesma utilizada anteriormente." });
        }

        now.setDate(now.getDate() + 30);
        user.password = password;
        user.passwordReminderTip = passwordReminderTip;
        user.expirePassword = now;
        await user.save();

        return res.status(200).json({ Sucesso: "Senha redefinida com sucesso." });
    } catch (error) {
        res.status(400).send({error: 'Houve um erro'});
    }
}

module.exports = {
    create,
    findOne,
    refreshToken,
    login,
    updateOne,
    deleteOne,
    forgotPassword,
    resetForgotPassword,
    resetExpirePassword,
    resetPasswordSendMail
}