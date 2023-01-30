import React from "react"
import { Link, useNavigate } from "react-router-dom"
// import { passInputData } from "../App"
import axios from "axios"

export default function New(props) {
  // 用解構賦值定義從App.js透過props傳過來的inputData以及setInputData
  const { inputData, setInputData } = props

  const navigate = useNavigate()

  function handleChangeData(event) {
    const { name, type, value } = event.target
    const date = new Date()
    setInputData((prev) => {
      return ({
        ...prev,
        [name]: type === "checkbox" ? !inputData.urgent : value,
        time: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      })
    })
  }

  const [saveClicked, setSaveClicked] = React.useState(false)
  const [warning, setWarning] = React.useState({
    task: false,
    detail: false
  })

  React.useEffect(() => {
    if (saveClicked === false) return

    axios.post('/api/todo/new', inputData, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    })
      .then(() => {
        // 從App.js透過props傳過來的state，用來在new完todo後，回首頁時會re-render，以及時render出新創建的todo
        props.setNewTodoSuccessOrNot(true)
        navigate('/todo')
        // 如果POST、資料存進資料庫成功，清空inputData
        setInputData((prev) => {
          return ({
            ...prev,
            task: "",
            detail: "",
            urgent: false,
            time: ""
          })
        })
      })
      .catch((err) => {
        if (err.response.data.wrongByUserInput) {
          setWarning(err.response.data)
        }
      })

    setSaveClicked(false)

    return () => { props.setNewTodoSuccessOrNot(false) }
  }, [saveClicked, inputData, navigate, props])

  return (
    <main className="main">
      <form className="form-for-new-edit-login-register" action="/todo/new" method="POST">
        <label htmlFor="task">
          {inputData.task.length > 45 ? <h5 className="warning">{inputData.task.length} / 45 (must be within 45 words)</h5> : <h5 className="warning">words limit reminder : {inputData.task.length} / 45</h5>}
          <textarea type="text" name="task" id="task" placeholder="Arrange your task (within 45 chars)" onChange={handleChangeData} value={inputData.task} required />
        </label>
        <label htmlFor="detail">
          <textarea type="text" name="detail" id="detail" placeholder="Something detail ... (within 250 chars)" onChange={handleChangeData} value={inputData.detail} />
          {warning.detail && <h5 className="warning">{warning.detail}</h5>}
        </label>
        <div className="form-for-new-edit-login-register-bottom">
          <label htmlFor="urgent" className="label-urgent" style={{ color: inputData.urgent ? "#ecac0c" : "#cfd3d3" }}>
            <input type="checkbox" name="urgent" id="urgent" checked={inputData.urgent} onChange={handleChangeData} />
            URGENT
          </label>
          <div className="btn-wrap">
            <Link className="btn" to="/todo">cancel</Link>
            <button className="btn" onClick={(event) => {
              event.preventDefault()
              setSaveClicked(true)
            }} >save</button>
          </div>
        </div>
      </form>
    </main>
  )
}