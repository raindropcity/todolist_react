import React from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuthLogin from "./OAuthLogin"
import axios from "axios"

export default function Login(props) {
  const { inputDataUserInfo, setInputDataUserInfo, setInputData, setToRegister, setUsernameForNav } = props

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
  const [warning, setWarning] = React.useState({
    email: false,
    password: false
  })

  React.useEffect(() => {
    if (loginClicked === false) return

    axios.post('/api/todo/login', inputDataUserInfo)
      .then((responseFromBackend) => {
        navigate('/todo')
        if (responseFromBackend.data.userAuthSuccess) {
          setInputData((prev) => {
            return ({
              ...prev,
              userID: responseFromBackend.data.authedUser._id
            })
          })

          setUsernameForNav(responseFromBackend.data.authedUser.username)
        }
        // 如果POST、資料存進資料庫成功，清空inputDataUserInfo
        setInputDataUserInfo({
          username: "",
          email: "",
          password: "",
          comfirmPassword: ""
        })
      })
      .catch((err) => {
        if (err.response.data.wrongByUserInput) setWarning(err.response.data)
      })

  }, [loginClicked, navigate])

  return (
    <main className="main">
      <form className="form-for-new-edit-login-register" action="/todo/login" method="POST">
        <label htmlFor="email">
          <input type="text" name="email" id="email" placeholder="Email" onChange={handleChangeData} value={inputDataUserInfo.email} required />
          {warning.email && <h5 className="warning">{warning.email}</h5>}
        </label>
        <label htmlFor="password">
          <input type="text" name="password" id="password" placeholder="Password" onChange={handleChangeData} value={inputDataUserInfo.password} />
          {warning.password && <h5 className="warning">{warning.password}</h5>}
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
              <OAuthLogin />
            </div>
            <div className="btn-wrap-inner">
              <button className="btn" onClick={(event) => {
                event.preventDefault()
                setLoginClicked(true)
              }} >login</button>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}