const mongoose = require('../config/db')
const UserModel = require('../models/userModel')

async function create(req, res) {    
    const { body } = req

    try {
        const user = await UserModel.create(body)
        res.status(201).json(user)
    } catch (error) {
        res.json(error)
    }
}

async function findOne(req, res) {    
    const { id } = req.query
    try {
        const user = await UserModel.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.json(error)
    }
}

module.exports = {
    create,
    findOne
}