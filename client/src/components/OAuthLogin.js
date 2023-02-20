import React from "react"

const CLIENT_ID = 'caa7bc3d870a03fdc550'

export default function OAuthLogin() {
  // 步驟：
  // 將user 導向Github的login畫面(要提供client ID)
  // user登入Github
  // 登入Github後，將user 導回localhost:3000
  // 此時的網址會變成localhost:3000/?code=ASDFASDFASDF，代表是user成功登入Github後導回來的，並給了一個code (這個code屬於Authorization Grant，代表使用者同意授權TodoList從Github中獲取其資料)
  // 接著用此code來向Github取得access token(注意code只能用一次，因此移除React 的strict mode)
  function loginWithGithub() {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID)
  }

  return (
    <button className="btn btn-oauth" onClick={loginWithGithub}> Login with Github</button>
  )
}