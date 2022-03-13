const firestore = require('../config/db');
const CreateUsers = require('../model/createUsers');

const getAllUsers = async (req, res, next) => {
    try {
        const users = firestore.collection('createUsers');
        const data = await users.get();
        const usersArray = [];
        if(data.empty) res.status(404).send('Nenhum usuário encontrado.')
        else {
            data.forEach(doc => {
                const createUsers = new CreateUsers(
                    doc.userID,
                    doc.data().name,
                    doc.data().email,
                    doc.data().password,
                    doc.data().passwordReminder,
                    doc.data().phoneNumber
                );
                usersArray.push(createUsers);
            });
            res.send(usersArray);
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = firestore.collection('createUsers').doc(id);
        const data = await user.get(id);
        if(!data.exists) res.status(404).send("Usuário não existe ou não foi encontrado.");
        else res.send(data.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = await firestore.collection('createUsers').doc(id);
        await user.update(data);
        res.send("Usuário atualizado com sucesso.");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('createUsers').doc(id).delete();
        res.send('Usuário deletado com sucesso.');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser };