// 總路由
const express = require('express')
const router = express.Router()
const todo = require('./modules/todo')
const home = require('./modules/home')
const passport = require('./modules/passport').router

router.use(home)

router.use(todo)

router.use(passport)

module.exports = router