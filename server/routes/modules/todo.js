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

// // 使用者身分驗證
// // 比對req.body過來的email有沒有在DB裡面，若有，接續確認password是否正確；若無，res錯誤提示
// // 確認email與password都正確後，在req.session中建一個userAuthenticated: true。並res該使用者的 _id給前端
// // create todo時要自動一併存入使用者的 _id
// // 首頁render時，只render該使用者 _id的 todo出來
// // LogOut時，req.session.authenticated要變為false，讓ensureAuthenticated去阻擋未登入者的操作
// router.post('/api/todo/login', express.json(), (req, res) => {
//   const { email, password } = req.body
//   User.findOne({ email: email }, (err, foundUser) => {
//     // mongoose發生錯誤
//     if (err) return console.log(err)
//     // 驗證失敗
//     else if (!foundUser) {
//       return res.status(404).json({
//         wrongByUserInput: true,
//         email: 'unsigned email'
//       })
//     }
//     else if (password !== foundUser.password) {
//       return res.status(404).json({
//         wrongByUserInput: true,
//         password: 'incorrect password'
//       })
//     }
//     // 驗證成功
//     req.session.userAuthenticated = true
//     req.session.userID = foundUser._id
//     req.session.username = foundUser.username
//     console.log(req.session.userAuthenticated)
//     return res.status(200).json({
//       userAuthSuccess: true,
//       authedUser: foundUser
//     })
//   })
// })

// router.get('/api/todo/user-auth-state', express.json(), (req, res) => {
//   return res.json({
//     userAuthenticated: req.session.userAuthenticated,
//     username: req.session.username
//   })
// })

// router.post('/api/todo/user-auth-state', express.json(), (req, res) => {
//   console.log(req.body.logOutClicked)
//   if (req.body.logOutClicked) {
//     req.session.userAuthenticated = false
//     req.session.userID = undefined
//   }
//   return res.json(req.session.userAuthenticated)
// })

// function ensureAuthenticated(req, res, next) {
//   console.log('ensureAuthenticated:' + req.session.userAuthenticated)
//   if (req.session.userAuthenticated === undefined || req.session.userAuthenticated === null || !req.session.userAuthenticated) {
//     console.log('ensureAuthenticated:' + req.session.userAuthenticated)
//     return res.json({ ensureAuthenticated: false })
//   }
//   return next()
// }

module.exports = router