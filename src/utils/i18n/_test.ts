import { Localization } from '.'

const test: Localization = {
  // general
  app_name: 'TEST',
  loading: 'TEST',

  // errors
  error: {
    input: {
      required: 'TEST'
    },
    api: {
      timeout: 'TEST',
      unknown: 'TEST',
      invalid_login: 'TEST',
      invalid_register: 'TEST',
      invalid_otp: 'TEST',
      duplicate_register: 'TEST'
    }
  },

  // pages
  pages: {
    // register
    register: {
      title: 'TEST',
      instructions: 'TEST',
      input: {
        label: {
          email: 'TEST',
          name: 'TEST',
          password: 'TEST'
        }
      },
      button: {
        go_login: 'TEST',
        register: 'TEST'
      },
      notification: {
        success: 'TEST'
      }
    },

    // login
    login: {
      title: 'TEST',
      instructions: 'TEST',
      input: {
        label: {
          email: 'TEST',
          password: 'TEST'
        }
      },
      button: {
        go_register: 'TEST',
        login: 'TEST',
        forgot_pass: 'TEST'
      }
    },

    // verify 2fa modal
    auth2fa: {
      title: 'TEST',
      instructions: 'TEST',
      input: {
        label: {
          otp: 'TEST'
        }
      },
      button: {
        submit: 'TEST'
      },
      error: {
        otp_length: 'TEST'
      }
    },

    // account
    account: {
      heading: {
        _2fa: 'TEST',
        sessions: 'TEST'
      },
      button: {
        logout: 'TEST',
        enable_2fa: 'TEST',
        disable_2fa: 'TEST',
        show_2fa_codes: 'TEST',
        revoke_session: 'TEST'
      },
      text: {
        _2fa_status: 'TEST',
        _2fa_enabled: 'TEST',  // used in 1 sentence with '_2fa_status'
        _2fa_disabled: 'TEST'  // used in 1 sentence with '_2fa_status'
      },
      error: {
        no_sessions: 'TEST',
        fail_sessions: 'TEST',
        fail_revoke_session: 'TEST',
        fail_disable_2fa: 'TEST'
      },
      notification: {
        _2fa_disabled: 'TEST',
        session_revoked: 'TEST'
      }
    },

    // setup 2fa modal
    setup2fa: {
      title: 'TEST',
      close: 'TEST',
      instruction: {
        0: 'TEST',
        1: 'TEST',
        2: 'TEST',
        3: 'TEST'
      },
      input: {
        label: {
          otp: 'TEST'
        }
      },
      button: {
        submit: 'TEST'
      },
      notification: {
        fail: 'TEST',
        success: 'TEST'
      }
    },

    // error
    error: {
      404: {
        title: 'TEST',
        message: 'TEST'
      }
    }
  },

  // notifications
  notification: {
    title: 'TEST',
    msg_default: 'TEST'
  },

  // modals
  modal: {
    close: 'TEST'
  }
}

export default test