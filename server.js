const express = require('express')
const app = express()
const cors = require('cors')
const Router = require('./server/routes/routes')
const passport = require('./server/routes/modules/passport').exportedPassport
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const User = require('./server/models/user')
const PORT = process.env.PORT || 3002

app.use(cors())

// 引用MongoDB連線設定
require('./server/config/mongoose')

// body-parser的方法，解析前後端傳遞的String或Array型別資料 
app.use(express.urlencoded({ extended: true }))

// body-parser的方法，解析前後端傳遞的json型別資料
// 沒有像上面express.urlencoded常用，可以在需要使用的特定路由個別透過middleware的方式引用，節省效能
// app.use(express.json())

// 初始化express-session
app.use(session({
  secret: 'road to become software engineer', //必要欄位，用來註冊 session ID cookie 的字串。如此將增加安全性，避免他人在瀏覽器中偽造 cookie。
  resave: false, //不論 request 的過程中有無變更都重新將 session 儲存在 session store。
  saveUninitialized: false, //將 uninitialized session（新的、未被變更過的） 儲存在 session store 中。
  store: new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb+srv://todolistreact:learnreact@cluster0.apubehn.mongodb.net/todolist_react?retryWrites=true&w=majority',
    collection: 'mySessions'
  }) //設定session要存放的資料庫位子(存在MongoDB裡面)
}))

// 初始化passport
app.use(passport.initialize())
app.use(passport.session())

// serializeUser()控制「要將哪些通過驗證的使用者資訊(物件形式)存進req.session.passport.user中」，這邊是將使用者的「_id」存進去。
passport.serializeUser((userObj, done) => {
  done(null, userObj._id)
})
// deserializeUser()則用於使用serializeUser()存進去req.session.passport.user的userObj._id 去尋找該使用者的整包資料，並將該物件存入req.user中，供後續取用。
passport.deserializeUser((id, done) => {
  User.findById(id, (err, foundUser) => {
    done(err, foundUser)
  })
})

// 引用總路由
app.use(Router)

// 當環境變數(NODE_ENV)在某個非localhost的主機上時，會被定義。而在雲端主機如heroku上時，會被定義為「production」
// 以下code的意思是，當app運行在heroku上時，去存放在client資料夾中找到build資料夾，提供裡面的靜態檔案 → express.static('client/build') ； res.sendFile()則是代表傳遞/client/build/index.html這個檔案並render出來
// 「if (process.env.NODE_ENV === 'production')」 is a way that we know the app is running on heroku
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`App is now running on http://localhost:${PORT}!`)
})