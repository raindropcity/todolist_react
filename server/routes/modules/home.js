// 「首頁」路由。 判斷首頁應去資料庫篩選出哪一位user的待辦清單
const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')
const ensureAuthenticated = require('./todo').ensureAuthenticated

router.get('/api/todo', ensureAuthenticated, express.json(), (req, res) => {
  console.log(req.session.userID)
  Todo.find({ userID: req.session.userID })
    .then((todos) => {
      res.status(200).json(todos)
    })
    .catch((err) => console.log(err))
})

router.put('/api/todo', ensureAuthenticated, express.json(), (req, res) => {
  const { currentTodoId } = req.body
  Todo.findById(currentTodoId)
    .then((todo) => {
      res.status(200).json(todo)
    })
    .catch((err) => console.log(err))
})

// 控制首頁按下星號後，於該todo前加上橘色點點
router.put('/api/changeUrgentState', ensureAuthenticated, express.json(), (req, res) => {
  const { id, urgent } = req.body

  Todo.findById(id)
    .then((todo) => {
      todo.urgent = urgent
      todo.save()
      return res.status(200).json({ urgentStateChanged: true })
    })
    .catch((err) => console.log(err))
})

// 刪除特定todo
router.put('/api/deleteTodo', ensureAuthenticated, express.json(), (req, res) => {
  const { id } = req.body

  Todo.findById(id)
    .then((todo) => {
      todo.remove()
      console.log('Todo is deleted')
      res.send('todo deleted')
    })
    .catch((err) => console.log(err))
})

module.exports = router