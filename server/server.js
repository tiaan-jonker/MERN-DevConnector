const express = require('express')
const connectDB = require('./config/db')

// Importing routes
const usersRoute = require('./routes/api/users')
const authRoute = require('./routes/api/auth')
const profileRoute = require('./routes/api/profile')
const postsRoute = require('./routes/api/posts')

const server = express()

// Database connection
connectDB()

server.get('/', (req, res) => res.send('API running'))

// Define routes
server.use('/api/users', usersRoute)
server.use('/api/auth', authRoute)
server.use('/api/profile', profileRoute)
server.use('/api/posts', postsRoute)

module.exports = server
