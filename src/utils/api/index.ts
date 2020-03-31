import Axios, { AxiosResponse } from 'axios'
import Config from '@/config'
import { User, DeviceSession, AccountLog } from './models'
import { getAuthUserId, logout } from './auth'


const API = Axios.create({
  baseURL: Config.API_URL,
  timeout: Config.API_TIMEOUT,
  withCredentials: true
})


// RESPONSE INTERFACES

export interface NoContentResponse {}  // 204

export interface AuthenticationResponse {
  readonly user: User
  readonly expiresIn: number,
  readonly token?: string
}

export interface Prepared2FAResponse {
  readonly registration: string,
  readonly key2FA: string
}

export interface UserResponse {
  readonly user: User
}

export interface UsersResponse {
  readonly users: User[]
}

export interface UserCreatedResponse {
  readonly message: string
}

export interface DeviceSessionsResponse {
  readonly sessions: DeviceSession[]
}

export interface AccountLogsResponse {
  readonly logs: AccountLog[]
}


// API CALLS

export default {
  // AUTH BASE

  async login(email: string, password: string): Promise<AuthenticationResponse> {
    return handleResponse(API.post('/auth/login', { email, password }))
  },

  async logout(): Promise<NoContentResponse> {
    return handleResponse(API.post('/auth/logout'))
  },

  async requestReset(email: string): Promise<NoContentResponse> {
    return handleResponse(API.post('/auth/reset', {
      email,
      link: Config.URL_PASSWORD_RESET
    }))
  },

  async resetPassword(token: string, password: string): Promise<NoContentResponse> {
    return handleResponse(API.put('/auth/reset/' + token, { password }))
  },

  async verifyEmail(token: string): Promise<NoContentResponse> {
    return handleResponse(API.put('/auth/verify/' + token))
  },

  // AUTH 2FA

  async prepare2FA(): Promise<Prepared2FAResponse> {
    return handleResponse(API.post('/auth/2fa'))
  },

  async verify2FA(token: string): Promise<AuthenticationResponse> {
    return handleResponse(API.post('/auth/2fa/verify/', { token }))
  },

  async disable2FA(): Promise<NoContentResponse> {
    return handleResponse(API.delete('/auth/2fa'))
  },

  // USERS COLLECTION

  async createUser(email: string, name: string, password: string): Promise<UserCreatedResponse> {
    return handleResponse(API.post('/users', {
      email, name, password,
      link: Config.URL_EMAIL_VERIFICATION
    }))
  },

  async getAllUsers(): Promise<UsersResponse> {
    return handleResponse(API.get('/users'))
  },

  async getUserById(id: string): Promise<UserResponse> {
    return handleResponse(API.get('/users/' + id))
  },

  async changeUserById(id: string, email?: string, name?: string, password?: string): Promise<NoContentResponse> {
    return handleResponse(API.put('/users/' + id, { email, name, password }))
  },

  async removeUserById(id: string): Promise<NoContentResponse> {
    return handleResponse(API.delete('/users/' + id))
  },

  async getDeviceSessions(): Promise<DeviceSessionsResponse> {
    return handleResponse(API.get('/users/' + getAuthUserId() + '/sessions'))
  },

  async revokeSession(hash: string): Promise<NoContentResponse> {
    return handleResponse(API.delete('/users/' + getAuthUserId() + '/sessions', { data: { hash } }))
  },

  async getAccountLogs(): Promise<AccountLogsResponse> {
    return handleResponse(API.get('/users/' + getAuthUserId() + '/logs'))
  }
}


// HELPERS

export enum ErrorCodes {
  // local
  TIMEOUT       =0,   // Timeout
  // API
  OK            =200, // OK
  CREATED       =201, // Created
  NO_CONTENT    =204, // No Content

  BAD_REQUEST   =400, // Bad Request
  UNAUTHORIZED  =401, // Unauthorized
  FORBIDDEN     =403, // Forbidden
  NOT_FOUND     =404, // Not Found
  CONFLICT      =409, // Conflict

  UNKNOWN_ERROR =500  // Unknown server error
}

export interface APIError {
  (reason: ErrorCodes): void
}

function handleResponse<T>(request: Promise<AxiosResponse<any>>): Promise<T> {
  return new Promise((resolve: (value: T) => void, reject: APIError) => {
    request
      .then(res => resolve(res.data))
      .catch(err => {
        // No response = timeout
        let errorCode = ErrorCodes.TIMEOUT
        // If we got a response
        if (!!err.response) {
          // Check its error
          console.warn(err.response.data.code + ' - ' + err.response.data.title + ': ' + err.response.data.message)
          errorCode = err.response.data.code
        } else console.error('Client timed out!')
        reject(errorCode)
      })
  })
}
