const express = require('express');
const { createUsersController } = require('../controller/createUsersController');
const { getAllUsers, getUser, updateUser, deleteUser} = require('../controller/listUsersController');

const router = express.Router();
router.post('/User', createUsersController);
router.get('/Users', getAllUsers);
router.get('/User/:id', getUser);
router.put('/User/:id', updateUser);
router.delete('/User/:id', deleteUser);


module.exports = { routes: router }