const express = require('express')
const cors = require('cors')

const server = express()

server.use(express.json())
server.use(cors())

const port = 3001

server.listen(port, () => {
  console.log(`running on port ${port}`)
});