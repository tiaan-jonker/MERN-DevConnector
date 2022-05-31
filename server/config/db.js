const mongoose = require('mongoose')
const config = require('config')
// const db = require('./default.json')

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error(error.message)
    // Exit process when failure
    process.exit(1)
  }
}

module.exports = connectDB
