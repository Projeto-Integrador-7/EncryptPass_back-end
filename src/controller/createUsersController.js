const firestore = require('../config/db');

const createUsersController = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('createUsers').doc().set(data);
        res.send("Usuário cadastrado com sucesso.");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = { createUsersController };