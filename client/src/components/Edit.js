import axios from "axios"
import React from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

export default function Edit(props) {
  const currentTodoId = useParams()
  const navigate = useNavigate()

  // 用解構賦值定義從App.js透過props傳過來的inputData以及setInputData
  const { inputData, setInputData, setEditTodoSuccessOrNot } = props

  function handleChangeData(event) {
    const { name, value } = event.target
    setInputData((prev) => {
      return ({
        ...prev,
        [name]: value
      })
    })
  }

  const [saveClicked, setSaveClicked] = React.useState(false)
  const [warning, setWarning] = React.useState({
    task: false,
    detail: false
  })

  React.useEffect(() => {
    axios.put('/api/todo', { currentTodoId: currentTodoId.id })
      .then((dataFromBackend) => {
        if (JSON.stringify(inputData) !== JSON.stringify(dataFromBackend.data)) setInputData(dataFromBackend.data)

        setInputData(dataFromBackend.data)
      })
      .catch((err) => console.log(err))
  }, []) // 空陣列代表只在第一次render後觸發此effect

  React.useEffect(() => {
    if (saveClicked === false) return

    axios.put('/api/todo/edit', { currentTodoId: currentTodoId.id, task: inputData.task, detail: inputData.detail })
      .then((dataFromBackend) => {
        console.log(dataFromBackend.data)
        setEditTodoSuccessOrNot(true)
        setSaveClicked(false)
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
          setSaveClicked(false)
        }
      })
    // cleanup function
    return () => setEditTodoSuccessOrNot(false)
  }, [saveClicked, navigate])

  return (
    <main className="main">
      <form className="form-for-new-edit-login-register" action="/todo/edit/:id" method="POST">
        <label htmlFor="task">
          {inputData.task.length > 45 ? <h5 className="warning">{inputData.task.length} / 45 (must be within 45 words)</h5> : <h5 className="warning">words limit reminder : {inputData.task.length} / 45</h5>}
          <textarea type="text" name="task" id="task" placeholder="Arrange your task" onChange={handleChangeData} value={inputData.task} required />
        </label>
        <label htmlFor="detail">
          <textarea type="text" name="detail" id="detail" placeholder="Something detail ..." onChange={handleChangeData} value={inputData.detail} />
          {warning.detail && <h5 className="warning">{warning.detail}</h5>}
        </label>
        <div className="form-for-new-edit-login-register-bottom" id="form-for-edit-bottom">
          <div className="btn-wrap">
            <Link className="btn" to="/todo" onClick={() => {
              setInputData({
                task: "",
                detail: "",
                urgent: false,
                time: ""
              })
            }}>cancel</Link>
            <button className="btn" onClick={(event) => {
              event.preventDefault()
              setSaveClicked(true)
            }}>save</button>
          </div>
        </div>
      </form>
    </main >
  )
}