const express = require('express')

const server = express()

server.get('/', (req, res) => res.send('API running'))

module.exports = server
