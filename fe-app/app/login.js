import {get, set_style} from '/app/utils.js'
import {getGlobal, setGlobal} from '/app/global-state.js'

const login_input = get('password')
const login_button = get('password-button')
const login_background = get('login-background')

const login = async (password) => {
  let response = await fetch('/login', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrefPolicy: 'no-referree',
    body: JSON.stringify({password})
  })
  const text = await response.text()
  return [response.status, text]
}

const do_login = async (password) => {
  let [status, response] = await login(password)
  if( status == 202 && response) {
    setGlobal('logged', true)
    set_style(login_background, 'display', 'none')
  }
}

login_button.addEventListener('click', () => {
  do_login(login_input.value)
})

const Login = {}

export {Login}
