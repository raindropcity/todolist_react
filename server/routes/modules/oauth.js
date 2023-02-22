const express = require('express')
const router = express.Router()
const Axios = require('axios')
const User = require('../../models/user')

const CLIENT_ID = 'caa7bc3d870a03fdc550'
const CLIENT_SECRET = 'aee41db363ef72e62a58b32651bb8c6c1d43b78a'

router.get('/getAccessToken', express.json(), (req, res) => {
  // "code" being passed from the frontend
  console.log(req.query.code)
  const parameter = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`

  Axios.post(`https://github.com/login/oauth/access_token${parameter}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      res.json(data)
    })
})

// get user data
// Access token is going to be passed in as an Authorization header
router.get('getUserData', express.json(), (req, res) => {
  // req.get() returns the specified HTTP request header field which is case-insensitive(不區分大小寫)
  req.get('Authorization') // Bearer Access Token(乘載Access Token)

  Axios({
    method: 'get',
    url: 'https://api.github.com/user',
    headers: { 'Authorization': req.get('Authorization') } // Bearer Access Token
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      res.json(data)
    })
})

module.exports = router