const express = require('express')
const connectDB = require('../config/db')

// Importing routes
const usersRoute = require('./routes/api/v1/users')
const authRoute = require('./routes/api/v1/auth')
const profileRoute = require('./routes/api/v1/profile')
const postsRoute = require('./routes/api/v1/posts')

const server = express()

// Database connection
connectDB()

// Init middleware
server.use(express.json({ extended: false }))

server.get('/', (req, res) => res.send('API running'))

// Define routes
server.use('/api/v1/users', usersRoute)
server.use('/api/v1/auth', authRoute)
server.use('/api/v1/profile', profileRoute)
server.use('/api/v1/posts', postsRoute)

module.exports = server
