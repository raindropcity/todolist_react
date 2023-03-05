import React from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Register(props) {
  const { inputDataUserInfo, setInputDataUserInfo, setToRegister } = props

  const [registerClicked, setRegisterClicked] = React.useState(false)

  const navigate = useNavigate()

  function handleChangeData(event) {
    const { name, value } = event.target
    setInputDataUserInfo((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const [dataPosted, setDataPosted] = React.useState(false)

  const [warning, setWarning] = React.useState({
    userName: false,
    email: false,
    password: false,
    comfirmPassword: false
  })

  React.useEffect(() => {
    if (registerClicked === false) return

    axios.post('/api/todo/register', inputDataUserInfo, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    })
      .then((dataFromBackend) => {
        console.log('user info saved')
        setDataPosted(true)
        // 如果POST、資料存進資料庫成功，清空inputDataUserInfo
        setInputDataUserInfo({
          userName: "",
          email: "",
          password: "",
          comfirmPassword: ""
        })
        setToRegister(false)
      })
      .catch((err) => {
        if (err.response.data.wrongByUserInput) setWarning(err.response.data)
      })

    return () => {
      setRegisterClicked(false)
    }
  }, [registerClicked, inputDataUserInfo, navigate, props])

  return (
    <main className="main">
      {dataPosted ? <div className="form-for-new-edit-login-register">
        <h5 className="register-hint" onClick={() => { navigate('/todo/login') }}>Signed Successfully!</h5>
      </div> :
        <form className="form-for-new-edit-login-register" action="/todo/register" method="POST">
          <label htmlFor="userName">
            <input type="text" name="userName" id="userName" placeholder="Username" onChange={handleChangeData} value={inputDataUserInfo.username} required />
            {warning.userName && <h5 className="warning">{warning.userName}</h5>}
          </label>
          <label htmlFor="email">
            <input type="text" name="email" id="email" placeholder="Email" onChange={handleChangeData} value={inputDataUserInfo.email} required />
            {warning.email && <h5 className="warning">{warning.email}</h5>}
          </label>
          <label htmlFor="password">
            <input type="text" name="password" id="password" placeholder="Password" onChange={handleChangeData} value={inputDataUserInfo.password} />
            {warning.password && <h5 className="warning">{warning.password}</h5>}
          </label>
          <label htmlFor="comfirmPassword">
            <input type="text" name="comfirmPassword" id="comfirmPassword" placeholder="Comfirm Password" onChange={handleChangeData} value={inputDataUserInfo.comfirmPassword} />
            {warning.comfirmPassword && <h5 className="warning">{warning.comfirmPassword}</h5>}
          </label>
          <div className="form-for-new-edit-login-register-bottom" id="form-for-register">
            <div className="btn-wrap">
              <button className="btn" onClick={(event) => {
                event.preventDefault()
                setRegisterClicked(true)
              }} >register</button>
            </div>
          </div>
        </form>
      }
    </main >
  )
}