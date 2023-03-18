import React from "react"
import Navbar from "./components/Navbar"
import Todos from "./components/Todos"
import Login from "./components/Login"
import Register from "./components/Register"
import New from "./components/New"
import Edit from "./components/Edit"
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"
import "./App.css"

// 見筆記useContext()
// export const passInputData = React.createContext()

function App() {
  const [inputData, setInputData] = React.useState({
    userID: "waiting to write",
    task: "",
    detail: "",
    urgent: false,
    time: ""
  })

  const [inputDataUserInfo, setInputDataUserInfo] = React.useState({
    userName: "",
    email: "",
    password: "",
    comfirmPassword: ""
  })

  const [usernameForNav, setUsernameForNav] = React.useState(undefined)

  const [catchTodos, setCatchTodos] = React.useState([])
  const [newTodoSuccessOrNot, setNewTodoSuccessOrNot] = React.useState(false)
  const [editTodoSuccessOrNot, setEditTodoSuccessOrNot] = React.useState(false)
  const [deleteTodoSuccessOrNot, setDeleteTodoSuccessOrNot] = React.useState(false)
  const [changeUrgentState, setChangeUrgentState] = React.useState(false)
  const [loginSuccessOrNot, setLoginSuccessOrNot] = React.useState(false)
  const [toRegister, setToRegister] = React.useState(false)
  const [warning, setWarning] = React.useState({ authenticationState: false, msg: '' })

  // useNavigate()只能用在child component中，因此將未通過中介軟體ensureAuthenticated的情況，另外建立一個component，並加入App.js的JSX中
  function EnsureAuthenticatedUser() {
    const navigate = useNavigate()
    React.useEffect(() => {
      if (toRegister) return
      axios.get('/api/todo')
        .then((dataFromBackend) => {
          if (dataFromBackend.data.authenticationState === false) {
            console.log('frontend router protection')
            setLoginSuccessOrNot(false)
            navigate('/todo/login')
          }
        })
        .catch((err) => console.log(err))
    }, [navigate])
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFromBackend = await axios.get('/api/todo')
        if (dataFromBackend.data.authenticationState === false) return console.log('not login yet')
        if (JSON.stringify(catchTodos) !== JSON.stringify(dataFromBackend.data)) setCatchTodos(dataFromBackend.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [catchTodos, newTodoSuccessOrNot, editTodoSuccessOrNot, deleteTodoSuccessOrNot, loginSuccessOrNot, usernameForNav, changeUrgentState])

  console.log(catchTodos)
  console.log('re-render')

  const todos = catchTodos.map((todo) => {
    return (
      <Todos key={todo._id} todo={todo} setDeleteTodoSuccessOrNot={setDeleteTodoSuccessOrNot} setChangeUrgentState={setChangeUrgentState} />
    )
  })

  return (
    <Router>
      <EnsureAuthenticatedUser />
      <Navbar setInputData={setInputData} loginSuccessOrNot={loginSuccessOrNot} setLoginSuccessOrNot={setLoginSuccessOrNot} usernameForNav={usernameForNav} setUsernameForNav={setUsernameForNav} setWarning={setWarning} />
      <Routes>
        {/* 列示所有todo */}
        <Route path="/todo" element={
          <main className="main">
            <div className="todolist">
              <Link className="new-task" to="/todo/new">
                <i className="fas fa-pencil-alt"></i>
                <h4>New Task</h4>
              </Link>
              {todos}
            </div>
          </main>
        } />
        <Route path="/todo/login" element={<Login inputDataUserInfo={inputDataUserInfo} setInputDataUserInfo={setInputDataUserInfo} setInputData={setInputData} setUsernameForNav={setUsernameForNav} setLoginSuccessOrNot={setLoginSuccessOrNot} warning={warning} setWarning={setWarning} setToRegister={setToRegister} />} />
        <Route path="/todo/register" element={<Register inputDataUserInfo={inputDataUserInfo} setInputDataUserInfo={setInputDataUserInfo} setToRegister={setToRegister} />} />
        {/* New */}
        <Route path="/todo/new" element={<New inputData={inputData} setInputData={setInputData} setNewTodoSuccessOrNot={setNewTodoSuccessOrNot} />} />
        {/* Edit */}
        <Route path={`/todo/edit/:id`} element={<Edit todolist={catchTodos} inputData={inputData} setInputData={setInputData} setEditTodoSuccessOrNot={setEditTodoSuccessOrNot} />} />
      </Routes>
    </Router >
  )
}

export default App
