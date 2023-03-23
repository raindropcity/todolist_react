// 總路由
const express = require('express')
const router = express.Router()
const todo = require('./modules/todo')
const home = require('./modules/home')
const oauth = require('./modules/oauth')
const passport = require('./modules/passport').router

router.use(home)

router.use(todo)

router.use(oauth)

router.use(passport)

module.exports = router