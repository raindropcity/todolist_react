import React from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuthLogin from "./OAuthLogin"
import axios from "axios"

export default function Login(props) {
  const { inputDataUserInfo, setInputDataUserInfo, setInputData, setToRegister, setUsernameForNav, warning, setWarning, setLoginSuccessOrNot, ensureAuthenticatedReminder, logOutClicked, setLogOutClicked, loginWithGithubSuccess, setLoginWithGithubSuccess } = props

  const [loginClicked, setLoginClicked] = React.useState(false)

  function handleChangeData(event) {
    const { name, value } = event.target
    setInputDataUserInfo((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const navigate = useNavigate()

  React.useEffect(() => {
    if (loginClicked === false) return

    axios.post('/api/todo/login', inputDataUserInfo)
      .then((responseFromBackend) => {
        console.log(responseFromBackend.data)

        if (responseFromBackend.data.authenticationState) {
          setInputData((prev) => {
            return ({
              ...prev,
              userID: responseFromBackend.data.user._id
            })
          })
          setUsernameForNav(responseFromBackend.data.user.userName)
          setLoginSuccessOrNot(true)
          setLogOutClicked(false)
        }
        else if (!responseFromBackend.data.authenticationState) {
          setLoginClicked(false)
          setWarning({ authenticationState: true, msg: responseFromBackend.data.warning })
          return
        }
        // 如果POST、資料存進資料庫成功，清空inputDataUserInfo
        setInputDataUserInfo({
          userName: "",
          email: "",
          password: "",
          comfirmPassword: ""
        })
        navigate('/todo')
      })
      .catch((err) => console.log(err))

  }, [loginClicked, navigate])

  return (
    <main className="main">
      <div className="form-for-new-edit-login-register">
        <label htmlFor="email">
          {ensureAuthenticatedReminder === 'Please login' && <h5 className="warning">{ensureAuthenticatedReminder}</h5>}
          <input type="email" name="email" id="email" placeholder="Email" onChange={handleChangeData} value={inputDataUserInfo.email} required />
        </label>
        <label htmlFor="password">
          <input type="password" name="password" id="password" placeholder="Password" onChange={handleChangeData} value={inputDataUserInfo.password} />
          {warning.authenticationState && <h5 className="warning">{warning.msg}</h5>}
        </label>
        <div className="form-for-new-edit-login-register-bottom">
          <div className="btn-wrap">
            <div className="register-btn">
              <h5>Sign here!</h5>
              <Link className="btn" to="/todo/register" onClick={(event) => {
                setToRegister(true)
              }}>register</Link>
            </div>
            <div className="btn-wrap-inner">
              <OAuthLogin setInputData={setInputData} setUsernameForNav={setUsernameForNav} logOutClicked={logOutClicked} loginWithGithubSuccess={loginWithGithubSuccess} setLoginWithGithubSuccess={setLoginWithGithubSuccess} />
            </div>
            <div className="btn-wrap-inner">
              <button className="btn" onClick={(event) => {
                event.preventDefault()
                setLoginClicked(true)
              }} >login</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}