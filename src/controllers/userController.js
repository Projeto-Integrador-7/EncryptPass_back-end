const mongoose = require('../config/db')
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
        const user = await UserModel.create(body)
        return res.status(201).json({success: "User created", user})
    } catch (error) {
        return res.status(400).json({error: "Bad request"})
    }
}

async function findOne(req, res) {    
    const { id } = req.query
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

        const result = await bcrypt.compare(password, user.password)

        if(result) {

            user.password = undefined;
            const token = generateToken(user._id)
            return res.status(200).json({user, token})
        }

        return res.status(401).json({ error: "Invalid 'password'" });
        
    } catch (err) {
        return res.status(400).json({ error: "Bad Request" });
    }
}

module.exports = {
    create,
    findOne,
    login
}