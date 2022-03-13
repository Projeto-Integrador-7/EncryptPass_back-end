const express = require('express')
const cors = require('cors')
const mongoose = require('./config/db')

const server = express()

server.use(express.json())
server.use(cors())

const port = 3005

server.listen(port, () => {
  console.log(`running on port ${port}`)
});

require("./routes/userRoutes") (server)