
import Vue from 'vue'
import VueI18n, { LocaleMessageObject } from 'vue-i18n'
import English from './_english'
import TEST from './_test'

Vue.use(VueI18n)

export interface Localization extends LocaleMessageObject {
  // general
  app_name: string,
  loading: string,

  // errors
  error: {
    input: {
      required: string
    },
    api: {
      timeout: string,
      unknown: string,
      invalid_login: string,
      invalid_register: string,
      invalid_otp: string,
      duplicate_register: string
    }
  },

  // pages
  pages: {
    // register
    register: {
      title: string,
      instructions: string,
      input: {
        label: {
          email: string,
          name: string,
          password: string
        }
      },
      button: {
        go_login: string,
        register: string
      },
      notification: {
        success: string
      }
    },

    // login
    login: {
      title: string,
      instructions: string,
      input: {
        label: {
          email: string,
          password: string
        }
      },
      button: {
        go_register: string,
        login: string,
        forgot_pass: string
      }
    },

    // verify 2fa modal
    auth2fa: {
      title: string,
      instructions: string,
      input: {
        label: {
          otp: string
        }
      },
      button: {
        submit: string
      },
      error: {
        otp_length: string
      }
    },

    // account
    account: {
      heading: {
        _2fa: string,
        sessions: string
      },
      button: {
        logout: string,
        enable_2fa: string,
        disable_2fa: string,
        show_2fa_codes: string,
        revoke_session: string
      },
      text: {
        _2fa_status: string,
        _2fa_enabled: string,  // used in 1 sentence with '_2fa_status'
        _2fa_disabled: string  // used in 1 sentence with '_2fa_status'
      },
      error: {
        no_sessions: string,
        fail_sessions: string,
        fail_revoke_session: string,
        fail_disable_2fa: string
      },
      notification: {
        _2fa_disabled: string,
        session_revoked: string
      }
    },

    // setup 2fa modal
    setup2fa: {
      title: string,
      close: string,
      instruction: {
        0: string,
        1: string,
        2: string,
        3: string
      },
      input: {
        label: {
          otp: string
        }
      },
      button: {
        submit: string
      },
      notification: {
        fail: string,
        success: string
      }
    },

    // error
    error: {
      404: {
        title: string,
        message: string
      }
    }
  },

  // notifications
  notification: {
    title: string,
    msg_default: string
  },

  // modals
  modal: {
    close: string
  }
}

export default new VueI18n({
  locale: 'en',
  messages: {
    en: English,
    test: TEST
  }
})