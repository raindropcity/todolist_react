import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Navbar(props) {
  const { setInputData, loginSuccessOrNot, setLoginSuccessOrNot, usernameForNav, setUsernameForNav, setWarning, logOutClicked, setLogOutClicked, setLoginWithGithubSuccess } = props

  React.useEffect(() => {
    if (logOutClicked === false) return

    axios.post('/api/todo/logout')
      .then((responseFromBackend) => {
        if (!responseFromBackend.data) {
          setLoginSuccessOrNot(false)
        }
      })
      .catch((err) => console.log(err))

    setUsernameForNav(undefined)
    setWarning({ authenticationState: false, msg: '' })
    setLoginWithGithubSuccess(false)
  }, [logOutClicked, loginSuccessOrNot, usernameForNav])

  return (
    <div className="navbar">
      <Link to="/todo" className="nav-leftpart" onClick={() => {
        setInputData((prev) => {
          return ({
            ...prev,
            task: "",
            detail: "",
            urgent: false,
            time: ""
          })
        })
      }}>
        <h2>{usernameForNav && <span style={{ color: '#ecac0c' }}>{usernameForNav}'s </span>}TodoList</h2>
      </Link>
      <Link to="/todo/login" className="nav-rightpart" onClick={() => {
        setLogOutClicked(true)
      }}>
        <h3>LogOut</h3>
      </Link>
    </div>
  )
}