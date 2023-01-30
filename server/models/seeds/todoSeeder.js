const db = require('../../config/mongoose')
const Todo = require('../todo')

db.once('open', () => {
  Todo.create({
    task: 'keep going, stop doubting',
    detail: 'Life is too short to doubt. Make it become the imagination you dream.',
    urgent: true
  })

  console.log('todoSeeder established')
})