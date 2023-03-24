// 使用者身分驗證策略
const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// 建立驗證策略(邏輯)
const Strategy = new LocalStrategy(
  // passport-local預設以資料庫中的username與password欄位進行身分驗證，若資料庫中的欄位名稱並非前述，要記得於此更改
  { usernameField: 'email' },
  // passport-local內建的callback叫做verify function用來寫驗證邏輯
  function verify(email, password, done) {
    console.log('passport strategy working')
    User.findOne({ email: email }, (err, foundUser) => {
      // mongoose去資料庫找資料時發生錯誤(為運行錯誤，非驗證失敗)
      if (err) return done(err)
      // 驗證失敗：可能user打錯email，資料庫中沒找到該email
      if (!foundUser) return done(null, false, { type: 'email', message: 'unsigned email' })
      // 驗證失敗：email沒打錯，但密碼打錯
      if (foundUser.password !== password) return done(null, false, { type: 'password', message: 'incorrect password' })
      // 驗證成功，回傳從資料庫中找到的user資料(在此取名為foundUser)
      return done(null, foundUser)
    })
  }
)
// 使用驗證策略
passport.use(Strategy)

router.post('/api/todo/login', express.json(),
  // 確認user是否已通過驗證，若已通過，直接return不接續下一個middleware；若未通過，接續下一個middleware
  (req, res, next) => {
    console.log('login api working')
    if (req.isAuthenticated()) return
    else if (!req.isAuthenticated()) {
      console.log('user auth fail: not login yet')
      return next()
    }
  },
  // 執行passport.js 驗證
  (req, res) => {
    passport.authenticate('local', (err, user, info) => {
      console.log('passport working')
      if (err) return console.log(err)
      // 驗證失敗
      if (!user) {
        console.log(info)
        return res.json({
          authenticationState: false,
          warning: 'incorrect email or password'
        })
      }
      // 驗證成功
      console.log('user auth success: login')
      req.login(user, (err) => {
        if (err) return console.log(err)
        return res.json({
          authenticationState: true,
          user: user,
          reminder: null
        })
      })
    })(req, res) // passport.authenticate(...)後接(req, res)，代表passport.authenticate這個方法執行後的結果
    // 舉例： const fn = function() { console.log('123') } → 這是一個函式
    // 但： const fn = function() { console.log('123') }() → 這是fn函式執行的結果，如果把 fn 印出來，會是字串123
  }
)

router.post('/api/todo/logout', express.json(), (req, res) => {
  req.logout((err) => {
    if (err) return console.log(err)
    console.log('logout')
    return res.json({
      authenticationState: false
    })
  })
})

module.exports = {
  router: router,
  exportedPassport: passport,
  ensureAuthenticated: (req, res, next) => {
    console.log('ensureAuthenticated working')
    if (!req.isAuthenticated()) {
      return res.json({
        authenticationState: false,
        reminder: 'Please login'
      })
    }
    return next()
  }
}