import API, { AuthenticationResponse, APIError } from '.'
import { User } from './models'
import Store, { Actions, Commits } from '@/utils/store'

const LCL_EXPIRES = '_exp'
const LCL_USER_ID = '_uid'
const LCL_PASS2FA = '_2fa'

// API CALLS

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject: APIError) => {
    API.login(email, password)
      .then(res => saveLoginDetails(res, resolve))
      .catch(reject)
  })
}

export function verify2FA(token: string): Promise<User> {
  return new Promise((resolve, reject: APIError) => {
    API.verify2FA(token)
      .then(res => saveLoginDetails(res, resolve))
      .catch(reject)
  })
}

export function disable2FA(): Promise<User> {
  return new Promise((resolve, reject: APIError) => {
    API.disable2FA()
      .then(_ => {
        localStorage.setItem(LCL_PASS2FA, 'false')
        resolve()
      })
      .catch(reject)
  })
}

function saveLoginDetails(res: AuthenticationResponse, resolve: (value: User) => void) {
  // Save persistent info to local storage
  localStorage.setItem(LCL_EXPIRES, String(Date.now() + res.expiresIn))
  localStorage.setItem(LCL_USER_ID, res.user._id)
  localStorage.setItem(LCL_PASS2FA, String(res.user.passed2FA))
  Store.commit(Commits.SET_USER, res.user)
  resolve(res.user)
}

export function getAuthUserId(): string | null {
  return localStorage.getItem(LCL_USER_ID)
}

export function logout(): void {
  API.logout().finally(clearStorage)
}

function clearStorage(): void {
  localStorage.removeItem(LCL_EXPIRES)
  localStorage.removeItem(LCL_USER_ID)
  localStorage.removeItem(LCL_PASS2FA)
}

// ROUTER MIDDLEWARE

export function requireAuth(to: any, _: any, next: Function): void {
  isLoggedIn().then(loggedIn => {
    if (loggedIn) return next()
    // Go home
    next({
      path: '/',
      query: { target: to.fullPath }
    })
  })
}

/**
 * Check if the current user is logged in
 * Checks the 
 */
export function isLoggedIn(): Promise<Boolean> {
  return new Promise((resolve, _) => {
    Store.dispatch(Actions.GET_USER, { id: getAuthUserId() })
      .then(user => {
        const _2fa: boolean = !user.use2FA || (user.use2FA && (localStorage.getItem(LCL_PASS2FA) === 'true'))
        const expiresIn: string | null = localStorage.getItem(LCL_EXPIRES)
        resolve(_2fa && !!expiresIn && parseInt(expiresIn) > Date.now())
      })
      .catch(_ => resolve(false))
  })
}
