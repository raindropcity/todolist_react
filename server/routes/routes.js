// 總路由
const express = require('express')
const router = express.Router()
const todo = require('./modules/todo').router
const home = require('./modules/home')

router.use(home)

router.use(todo)

module.exports = router