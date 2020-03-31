
import Vue from 'vue'
import VueI18n, { LocaleMessageObject } from 'vue-i18n'
import English from './_english'
import TEST from './_test'

Vue.use(VueI18n)

export interface Localization extends LocaleMessageObject {
  // general
  app_name: string,
  loading: string,
  button_loading: string,
  unknown_location: string,

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
        sessions: string,
        event_log: string,
        deletion: string,
      },
      button: {
        logout: string,
        enable_2fa: string,
        disable_2fa: string,
        show_2fa_codes: string,
        revoke_session: string,
        show_event_log: string,
        delete: string
      },
      text: {
        _2fa_status: string,
        _2fa_enabled: string,  // used in 1 sentence with '_2fa_status'
        _2fa_disabled: string, // used in 1 sentence with '_2fa_status'
        _2fa_info: string,
        session_info: string,
        event_log_info: string,
        deletion_info: string
      },
      error: {
        no_sessions: string,
        fail_sessions: string,
        fail_revoke_session: string,
        fail_disable_2fa: string,
        fail_delete_account: string
      },
      notification: {
        _2fa_disabled: string,
        session_revoked: string,
        account_deleted: string
      },
      confirmation: {
        delete: {
          title: string,
          question: string,
          positive: string,
          negative: string
        }
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

    // account event logs
    account_log: {
      title: string,
      info: string,
      error: {
        no_logs: string
      },
      type: {
        1: string,
        2: string,
        3: string,
        4: string,
        5: string,
        6: string,
        7: string,
        8: string,
        9: string,
        10: string,
        11: string,
        12: string
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
    msg_default: string,
    confirmation: {
      title_default: string,
      question_default: string,
      button: {
        positive: string,
        neutral: string,
        negative: string
      }
    }
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