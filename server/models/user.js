const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  userName: {
    type: String
  },
  confirmPassword: {
    type: String
  }
})

module.exports = mongoose.model('User', userSchema)