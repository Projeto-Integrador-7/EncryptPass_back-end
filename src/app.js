const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const server = express()

server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(express.json())
server.use(cors())

const port = 3005

server.listen(port, () => {
  console.log(`running on port ${port}`)
});

require("./routes/userRoutes") (server)
require("./routes/credentialsRoutes") (server)