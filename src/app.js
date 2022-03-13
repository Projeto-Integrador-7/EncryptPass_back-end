const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const createUsersRouter = require('./routes/createUsersRouter');
//
const server = express();

server.use(express.json());
server.use(cors());
server.use(bodyParser.json());

server.use('/api', createUsersRouter.routes);

//
const port = 3005
server.listen(port, () => {
  console.log(`running on port ${port}`)
});