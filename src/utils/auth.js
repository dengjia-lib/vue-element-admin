import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'
const TokenKey = 'token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem('user_token')
}

// export function getToken(state) {
//   if (!state.token) {
//     state.token = localStorage.getItem('token')
//   }
//   return state.token
// }

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
