const express = require('express')
const router = express.Router()
const Axios = require('axios')
const User = require('../../models/user')

const CLIENT_ID = 'caa7bc3d870a03fdc550'
const CLIENT_SECRET = 'aee41db363ef72e62a58b32651bb8c6c1d43b78a'

router.get('/getAccessToken', express.json(), (req, res) => {
  // "code" being passed from the frontend
  console.log('get Access Token API is working')
  console.log(req.query.code)
  const parameter = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`

  async function getAccessTokenFromGithub() {
    try {
      const fetchAccessToken = await Axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token${parameter}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return res.json(fetchAccessToken.data)
    }
    catch (err) { console.log(err) }
  }

  getAccessTokenFromGithub()
})

// get user data
// Access token is going to be passed in as an Authorization header
router.post('/getUserDataFromGithub', express.json(), (req, res) => {
  const { accessToken } = req.body

  Axios({
    method: 'get',
    url: 'https://api.github.com/user',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'token ' + accessToken
    } // Bearer Access Token
  })
    .then((response) => {
      console.log('get Github data')
      console.log(response.data)

      User.findOne({ password: response.data.id }, (err, foundUser) => {
        if (err) return console.log(err)

        if (foundUser) {
          req.session.isLoggedIn = true
          req.session.userID = foundUser._id
          console.log(req.session)
          return res.json({
            isLoggedInWithGithub: req.session.isLoggedIn,
            userName: foundUser.userName,
            userID: foundUser._id
          })
        }
        else if (!foundUser) {
          const newUserFromGithub = new User({
            email: response.data.email,
            password: response.data.id,
            userName: response.data.login,
            confirmPassword: response.data.id
          })

          newUserFromGithub.save((err) => {
            if (err) console.log(err)
            else {
              req.session.isLoggedIn = true
              req.session.userID = foundUser._id
            }
          })
        }

        return res.json({
          isLoggedInWithGithub: req.session.isLoggedIn,
          userName: foundUser.userName,
          userID: foundUser._id
        })
      })
    })
    .catch((err) => console.log(err))
})

module.exports = router