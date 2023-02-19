// 總路由
const express = require('express')
const router = express.Router()
const todo = require('./modules/todo').router
const home = require('./modules/home')
const oauth = require('./modules/oauth')

router.use(home)

router.use(todo)

router.use(oauth)

module.exports = router