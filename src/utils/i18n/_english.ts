import { Localization } from '.'

const english: Localization = {
  app_name: 'User REST API',
  loading: 'Loading...',
  error: {
    input: {
      required: 'Please fill in this field'
    },
    api: {
      timeout: 'Could not load response in time!',
      unknown: 'Unknown error...',
      invalid_login: 'Invalid credentials provided!',
      invalid_register: 'Invalid email or display name provided!',
      invalid_otp: 'Invalid One-Time-Password. Please try again.',
      duplicate_register: 'This email address is already in use. Login or try to register with a different email address!'
    }
  },
  pages: {
    register: {
      title: 'Register',
      instructions: 'Register using a unique email address, a display name, and a strong password.',
      input: {
        label: {
          email: 'Email address',
          name: 'Name',
          password: 'Password'
        }
      },
      button: {
        go_login: 'Login',
        register: 'Register'
      },
      notification: {
        success: 'User has successfully been created!'
      }
    },
    login: {
      title: 'Login',
      instructions: 'Login using your registered email address, and password.',
      input: {
        label: {
          email: 'Email address',
          password: 'Password'
        }
      },
      button: {
        go_register: 'New?',
        login: 'Login',
        forgot_pass: 'Forgot password?'
      }
    },
    auth2fa: {
      title: 'Two-Factor Authentication',
      instructions: 'Please enter a One-Time-Password from your registered authenticator application.',
      input: {
        label: {
          otp: 'One-Time-Password'
        }
      },
      button: {
        submit: 'Verify'
      },
      error: {
        otp_length: 'One-Time-Password consists of 6 or 7 digits.'
      }
    },
    account: {
      heading: {
        _2fa: 'Two-factor authentication (2FA)',
        sessions: 'Current device sessions'
      },
      button: {
        logout: 'Logout',
        enable_2fa: 'Enable 2FA',
        disable_2fa: 'Disable 2FA',
        show_2fa_codes: 'Show recovery codes',
        revoke_session: 'Revoke'
      },
      text: {
        _2fa_status: '2FA is {0}.',
        _2fa_enabled: 'enabled',
        _2fa_disabled: 'disabled'
      },
      error: {
        no_sessions: 'No current active sessions.',
        fail_sessions: 'Device sessions cannot be loaded right now. Please try again later.',
        fail_revoke_session: 'Failed to revoke session!',
        fail_disable_2fa: '2FA cannot be disabled right now. Please try again later.'
      },
      notification: {
        _2fa_disabled: '2FA disabled!',
        session_revoked: 'Session revoked!'
      }
    },
    setup2fa: {
      title: 'Two-Factor Authentication',
      close: 'Cancel',
      instruction: {
        0: 'To enable 2FA, follow these steps:',
        1: '1. Open any authenticator application (e.g. Authy and Google Authenticator).',
        2: '2. Scan the QR-code or manually enter the key to register this service to the authenticator application.',
        3: '3. Confirm the registration by submitting the One-Time-Password.'
      },
      input: {
        label: {
          otp: 'One-Time-Password'
        }
      },
      button: {
        submit: 'Submit Code'
      },
      notification: {
        fail: '2FA cannot be enabled right now. Please try again later.',
        success: '2FA is successfully enabled!'
      }
    },
    error: {
      404: {
        title: 'Page Not Found',
        message: 'This page could not be found. The page may have moved, we may have redirected you wrongly, or the URL was spelled wrongly.'
      }
    }
  },
  notification: {
    title: 'Notification',
    msg_default: 'Success'
  },
  modal: {
    close: 'Close'
  }
}

export default english