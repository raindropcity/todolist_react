const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  userID: {
    type: String,
    required: true,
    default: 'waiting to write'
  },
  task: {
    type: String,
  },
  detail: {
    type: String,
  },
  urgent: {
    type: Boolean,
    default: false
  },
  time: {
    type: String,
  }
})

// 匯出的時候把這份 schema 命名為 Todo
module.exports = mongoose.model('Todo', todoSchema)