export interface User {
  _id: string,
  readonly verified: boolean,
  readonly email?: string,
  readonly name: string,
  readonly creation: string,
  use2FA: boolean,
  readonly passed2FA: boolean
}

export interface DeviceSession {
  readonly hash: string,
  readonly ip: string,
  readonly since: string,
  readonly expires: number,
  readonly platform: string,
  readonly application: string,
  readonly location?: string
}

export enum AccountEvent {
  LOGIN_FAIL=1,                 // Failed login attempt with the user's email address.
  LOGIN_SUCCESS=2,              // Successful login attempt with the user's email address.
  RESET_REQUEST=3,              // Password reset email was requested for the user.
  RESET_SUCCESS=4,              // User's password was reset successfully.
  INFORMATION_CHANGE_FAIL=5,    // Failed attempt to change the user's account information.
  INFORMATION_CHANGE_SUCCESS=6, // Successful attempt to change the user's account information.
  EMAIL_VERIFIED=7,             // Account email address was verified.
  _2FA_PREPARED=8,              // 2FA was prepared for the account to allow the user to link an authenticator mobile application.
  _2FA_ENABLED=9,               // 2FA was enabled for the account after a successful token verification.
  _2FA_DISABLED=10,             // 2FA was disabled for the account.
  _2FA_FAIL=11,                 // 2FA token verification request failed.
  _2FA_SUCCESS=12               // 2FA token verification request succeeded.
}

export interface AccountLog {
  readonly _id: string,
  readonly date: string,
  readonly ip: string,
  readonly type: AccountEvent,
  readonly location: string
}