import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Navbar(props) {
  const { setInputData, setLoginSuccessOrNot, usenameForNav, setUsernameForNav } = props
  const [logOutClicked, setLogOutClicked] = React.useState(false)

  React.useEffect(() => {
    if (logOutClicked === false) return
    // 傳logOutClicked去後端，如果它是true，將req.session.userAuthenticated改成false
    axios.post('/api/todo/user-auth-state', { logOutClicked: logOutClicked })
      .then((responseFromBackend) => {
        if (!responseFromBackend.data) {
          setLoginSuccessOrNot(false)
          setUsernameForNav('')
        }
      })
      .catch((err) => console.log(err))

    setLogOutClicked(false)
  }, [logOutClicked])

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