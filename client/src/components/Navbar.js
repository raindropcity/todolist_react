import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Navbar(props) {
  const { setInputData, loginSuccessOrNot, setLoginSuccessOrNot, usenameForNav, setUsernameForNav, warning, setWarning } = props
  const [logOutClicked, setLogOutClicked] = React.useState(false)

  React.useEffect(() => {
    if (logOutClicked === false) return

    axios.post('/api/todo/logout')
      .then((responseFromBackend) => {
        if (!responseFromBackend.data) {
          setLoginSuccessOrNot(false)
          setUsernameForNav('')
        }
      })
      .catch((err) => console.log(err))

    setWarning({ authenticationState: false, msg: '' })
    setLogOutClicked(false)
  }, [logOutClicked, loginSuccessOrNot])

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
        <h2>{usenameForNav && <span style={{ color: '#ecac0c' }}>{usenameForNav}'s </span>}TodoList</h2>
      </Link>
      <Link to="/todo/login" className="nav-rightpart" onClick={() => {
        setLogOutClicked(true)
      }}>
        <h3>LogOut</h3>
      </Link>
    </div>
  )
}