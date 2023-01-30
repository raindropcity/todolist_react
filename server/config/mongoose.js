const mongoose = require('mongoose')
// 取得資料庫連線狀態
const db = mongoose.connection
// 這邊路徑代表透過環境參數process.env.MONGODB_URI取用Heroku中所設定的MONGODB_URI，若沒有拿到，則去MongoDB Atlas的雲端資料庫中的todolist_react資料庫下面建立一個子資料庫
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://todolistreact:learnreact@cluster0.apubehn.mongodb.net/todolist_react?retryWrites=true&w=majority'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 資料庫連線異常
// db.on()：在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生。
db.on('error', () => {
  console.log('mongoDB connection error')
})

// 資料庫連線成功
// db.once()：針對「連線成功」的 open 情況，註冊一個事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongoDb connected')
})

// 匯出變數db
module.exports = db