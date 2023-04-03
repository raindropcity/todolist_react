const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')
const User = require('../../models/user')
const ensureAuthenticated = require('./passport').ensureAuthenticated
const { check, validationResult } = require('express-validator')


const validatorStrategyForNewAndEdit = [
  check('task').trim().notEmpty().withMessage('required field').bail().isLength({ max: 45 }).withMessage('must be within 45 characters'),
  check('detail').trim().isLength({ max: 250 }).withMessage('must be within 250 characters')
]

const validatorStrategyForRegisterAndLogin = [
  check('userName').trim().notEmpty().withMessage('required field').bail().isLength({ max: 12 }).withMessage('must be within 12 characters'),
  check('email').trim().notEmpty().withMessage('required field').bail().isEmail().withMessage('invalid email').bail().custom(async (value) => {
    const existOrNot = await User.findOne({ email: value })
    if (existOrNot) throw new Error('this email has already been signed')
    return true
  }),
  check('password').trim().notEmpty().withMessage('required field').bail().isAlphanumeric().withMessage('En alphabet or numeric only').isLength({ min: 6, max: 16 }).withMessage('must be within 6 - 16 characters'),
  check('comfirmPassword').trim().notEmpty().withMessage('required field').bail().custom((value, { req }) => {
    if (value !== req.body.password) throw Error('comfirm password failed')
    return true
  })
]

// Create：從前端的 New.js 接收資料(todo資料)
router.post('/api/todo/new', express.json(), ensureAuthenticated, validatorStrategyForNewAndEdit, (req, res) => {
  const { userID, task, detail, urgent, time } = req.body
  // 創建一個instance，存放前端傳過來的資料，後續會使用mongoose方法將這包資料存入MongoDB。(因為此物件中的key與value相同，因此可以這樣簡寫)
  const dataFromFrontend = new Todo({
    userID,
    task,
    detail,
    urgent,
    time,
    // userID: req.session.passport.user 之後要依據這組ID，讓首頁知道要render哪一個user的todos出來
  })
  // 未通過express-validator
  const somethingWrong = validationResult(req)
  let errMsgObj = {}
  if (!somethingWrong.isEmpty()) {
    somethingWrong.errors.forEach((eachObj) => {
      // 用物件的括弧記法新增key-value pair
      errMsgObj[eachObj.param] = eachObj.msg
    })

    return res.status(404).json({
      wrongByUserInput: true,
      ...errMsgObj
    })
  }

  // 通過express-validator，將資料存入後端資料庫
  dataFromFrontend.save((err) => {
    if (err) res.status(404).send('data storage error')
    else res.status(200).send('data storage success')
  })
})

// Update：修改某筆todo
router.put('/api/todo/edit', express.json(), ensureAuthenticated, validatorStrategyForNewAndEdit, (req, res) => {
  console.log(req.body)
  // 未通過express-validator
  const somethingWrong = validationResult(req)
  let errMsgObj = {}
  if (!somethingWrong.isEmpty()) {
    somethingWrong.errors.forEach((eachObj) => {
      // 用物件的括弧記法新增key-value pair
      errMsgObj[eachObj.param] = eachObj.msg
    })

    return res.status(404).json({
      wrongByUserInput: true,
      ...errMsgObj
    })
  }

  const { currentTodoId, task, detail } = req.body
  Todo.findById(currentTodoId)
    .then((todo) => {
      todo.task = task
      todo.detail = detail
      todo.save()
      return res.status(200).send('todo edited')
    })
    .catch((err) => console.log(err))
})

// Create：從前端的 Register.js 接收資料(user資料)
router.post('/api/todo/register', express.json(), validatorStrategyForRegisterAndLogin, (req, res) => {
  console.log(req.body)
  const { userName, email, password, comfirmPassword } = req.body
  const dataFromFrontend = new User({ userName, email, password, comfirmPassword })
  // 未通過express-validator
  const somethingWrong = validationResult(req)
  let errMsgObj = {}
  if (!somethingWrong.isEmpty()) {
    somethingWrong.errors.forEach((eachObj) => {
      // 用物件的括弧記法新增key-value pair
      errMsgObj[eachObj.param] = eachObj.msg
    })

    return res.status(404).json({
      wrongByUserInput: true,
      ...errMsgObj
    })
  }
  // 通過express-validator，將資料存入後端資料庫
  dataFromFrontend.save((err) => {
    if (err) res.status(404).send('data storage error')
    else res.status(200).send('data storage success')
  })
})

module.exports = router