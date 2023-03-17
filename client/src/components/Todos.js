import React from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Todos(props) {
  // 一般來說，當state被修改時會觸發re-render，但前提是該state要有用在 JSX 中。
  const { changeUrgentState, setChangeUrgentState } = props
  // 跟後端互動(使用axios)屬於side effect，要使用useEffect()，但是useEffect()無法直接寫在event handler函式裡面，因此宣告一個state叫做starIsClicked，當click事件發生時，它會變成true，藉此當starIsClicked是true時，useEffect()的後續內容可以被執行。也就是使用axios向後端發出請求。
  const [starIsClicked, setStarIsClicked] = React.useState(false)
  React.useEffect(() => {
    if (starIsClicked === false) return
    // 發出修改某筆資料中的urgent值。同時傳id給後端，讓後端可以使用findById()去找出哪一筆資料的urgent值要修改
    axios.put('/api/changeUrgentState', { id: props.todo._id })
      .then((dataFromBackend) => {
        setChangeUrgentState(true)
      })
      .catch((err) => console.log(err))

    setStarIsClicked(false)
    setChangeUrgentState(false)
  }, [starIsClicked])

  const [deleteIsClicked, setDeleteIsClicked] = React.useState(false)
  const [checkIsClicked, setCheckIsClicked] = React.useState(false)
  React.useEffect(() => {
    if (checkIsClicked === false) return
    async function sendReq() {
      try {
        // 因為axios.delete無法傳遞json給後端，所以這邊用axios.put
        const dataFromBackend = await axios.put('/api/deleteTodo', { id: props.todo._id })
        // 從App.js透過props傳過來的state，用來在delete完todo後，回首頁時會re-render，以及時render出沒有該todo的樣子
        if (dataFromBackend.data === 'todo deleted') props.setDeleteTodoSuccessOrNot(true)
      } catch (err) {
        console.log(err)
      }
    }
    sendReq()
    setCheckIsClicked(false)

    return () => { props.setDeleteTodoSuccessOrNot(false) }
  }, [props.todo._id, checkIsClicked])

  return (
    <div className="each-todo" >
      <Link className="each-todo-leftpart" to={`/todo/edit/${props.todo._id}`} style={{ textDecoration: "none", color: "#cfd3d3" }}>
        {props.todo.urgent && <i className="fas fa-circle"></i>}
        <div className="each-todo-main-msg">
          {props.todo.task.length > 30 ? <h5>{props.todo.task.slice(0, 30)} ···</h5> : <h5> {props.todo.task} </h5>}
          <h6> {props.todo.time} </h6>
        </div>
      </Link>

      {!deleteIsClicked && (
        <div className="each-todo-rightpart">
          <i className="far fa-star" style={{ color: props.todo.urgent ? "#ecac0c" : "#cfd3d3" }} onClick={() => setStarIsClicked(true)}></i>
          <i className="fas fa-trash-alt" onClick={() => setDeleteIsClicked(true)}></i>
        </div>
      )}

      {deleteIsClicked && (
        <div className="delete-confirm-dialog">
          <div className="dialog-box-triangle"></div>
          <div className="dialog-box">
            <h6>Sure ?</h6>
            <div className="dialog-icon">
              <i className="fas fa-check" onClick={() => setCheckIsClicked(true)}></i>
              <i className="fas fa-times" onClick={() => setDeleteIsClicked(false)}></i>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}