import React from "react"
import axios from "axios"

const CLIENT_ID = 'caa7bc3d870a03fdc550'

export default function OAuthLogin() {
  // 步驟：
  // 將user 導向Github的login畫面(要提供client ID)
  // user登入Github
  // 登入Github後，將user 導回localhost:3000
  // 此時的網址會變成localhost:3000/?code=ASDFASDFASDF，代表是user成功登入Github後導回來的，並給了一個code (這個code屬於Authorization Grant，代表使用者同意授權TodoList從Github中獲取其資料)
  // 接著用此code來向Github取得access token(注意code只能用一次，因此移除React 的strict mode)
  function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`)
  }

  const [rerender, setRerender] = React.useState(false)

  React.useEffect(() => {
    const queryString = window.location.search // 回傳 url 中的 parameter(網址中「?帶出的那串字」，又稱為 query；查詢符)
    const urlParameter = new URLSearchParams(queryString)
    const parseThecode = urlParameter.get('code') // URLSearchParams配合 get方法，用來印出 ?code=asdfasdf 中的「asdfasdf」
    console.log(parseThecode)

    // local storage雖然有被任何人看到的風險
    // 但可以暫存資料一陣子(例如本例用來存放access token)，如此，當user暫時離開已登入的app頁面一下，再回來時，還會是登入狀態

    // 在有 "code" 的情況下(代表是經由 user去 Github按下授權 app 取用資料後，redirect回來app)，並且local storage中還沒有存放Access Token 時，發出請求去向後端要Access Token 過來存放進local storage 中
    if (parseThecode && (localStorage.getItem('accessToken') === null)) {
      axios.get(`http://localhost:3002/getAccessToken?code=${parseThecode}`)
        .then((dataFromBackend) => {
          console.log(dataFromBackend.data)
          if (dataFromBackend.data) {
            localStorage.setItem('accessToken', dataFromBackend.data.slice(13, dataFromBackend.data.length))
            setRerender(!rerender)
          }
        })
        .catch((err) => console.log(err))
    }

  }, [])

  return (
    <button className="btn btn-oauth" onClick={loginWithGithub}> Login with Github</button>
  )
}