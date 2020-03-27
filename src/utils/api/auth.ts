import API, { AuthenticationResponse } from '.'
import { User } from './models'
import Store, { Actions, Commits } from '@/utils/store'

const LCL_EXPIRES = 'loginExpires'
const LCL_USER_ID = 'uid'

// API CALLS

export function login(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    API.login(email, password)
      .then(res => saveLoginDetails(res, resolve))
      .catch(reject)
  })
}

export function verify2FA(token: string): Promise<User> {
  return new Promise((resolve, reject) => {
    API.verify2FA(token)
      .then(res => saveLoginDetails(res, resolve))
      .catch(reject)
  })
}

function saveLoginDetails(res: AuthenticationResponse, resolve: (value: User) => void) {
  // Save persistent info to local storage
  localStorage.setItem(LCL_EXPIRES, String(Date.now() + res.expiresIn))
  localStorage.setItem(LCL_USER_ID, res.user._id)
  Store.commit(Commits.SET_USER, res.user)
  resolve(res.user)
}

export function getAuthUserId(): string | null {
  return localStorage.getItem(LCL_USER_ID)
}

export function logout(): void {
  localStorage.removeItem(LCL_EXPIRES)
  localStorage.removeItem(LCL_USER_ID)
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
        const _2fa: boolean = !user.use2FA || (user.use2FA && user.passed2FA)
        const expiresIn: string | null = localStorage.getItem(LCL_EXPIRES)
        resolve(_2fa && !!expiresIn && parseInt(expiresIn) > Date.now())
      })
      .catch(err => {
        console.warn(err)
        resolve(false)
      })
  })
}
