const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 500, 
	standardHeaders: true, 
	legacyHeaders: false, 
})

const server = express()

server.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(limiter)
server.use(express.json())
server.use(cors())

const port = 3005

server.listen(port, () => {
  console.log(`running on port ${port}`)
});

require("./routes/userRoutes") (server)
require("./routes/credentialsRoutes") (server)
require("./routes/folderRoutes") (server)