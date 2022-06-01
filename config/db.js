const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

// const db =
// 'mongodb+srv://tiaanj06:Uomo1947iliad@devconnector.d78jc.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.error('Database connection error in config: ', error.message)
    // Exit process when failure
    process.exit(1)
  }
}

module.exports = connectDB
