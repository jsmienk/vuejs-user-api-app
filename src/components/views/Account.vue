<template>
<main id="account" class="screen-padding">
  <!-- General user info -->
  <h1>{{ user.name }}</h1>
  <p class="user-id">{{ user._id }}</p>
  <p class="user-email" v-if="user.email">{{ user.email }}</p>
  <NavButton id="logout" @click-load="logout" class="button-warn">Log out</NavButton>

  <!-- 2FA -->
  <h3>Two-factor authentication (2FA)</h3>
  <p>2FA is <span class="_2fa-enabled" :class="{ enabled: user.use2FA }">{{ user.use2FA ? 'enabled' : 'disabled' }}.</span></p>
  <!-- Enable/disable -->
  <div class="button-row">
    <NavButton @click-load="viewCodes" v-if="user.use2FA">Show recovery codes</NavButton>
    <NavButton @click-load="on2FAClick">{{ user.use2FA ? 'Disable' : 'Enable' }} 2FA</NavButton>
  </div>

  <!-- Device sessions -->
  <h3>Current device sessions</h3>
  <!-- Loading/error messages -->
  <p v-if="!sessionsError && sessions === null">Loading...</p>
  <p v-if="!!sessions && sessions.length === 0">No current active sessions.</p>
  <p v-if="!!sessionsError" class="text-error">{{ sessionsError }}</p>
  <!-- Session list -->
  <div class="device-session" v-for="session in sessions" :key="session._id">
    <div class="info">
      <!-- Icon -->
      <img class="icon" src="@/assets/devices.svg" />
      <!-- Text details -->
      <div class="details">
        <h4 class="device">{{ session.platform }} {{ session.application }}</h4>
        <div class="expires">{{ getSessionDate(session) }}</div>
        <div class="ip">{{ session.ip }}</div>
        <div class="location" v-if="session.location">{{ session.location }}</div>
      </div>
    </div>

    <!-- Revoke button -->
    <NavButton @click-load="revokeSession($event, session.hash)" class="button-warn session-revoke">Revoke</NavButton>
  </div>

  <Setup2FAModal ref="setup2FAModal" @success="user.use2FA = true" />
  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import API from '@/utils/api'
import { getDateTimeString } from '@/utils/helpers'
import { User, DeviceSession } from '@/utils/api/models'
import { getAuthUserId, logout } from '@/utils/api/auth'
import { Pages, PageRoutes } from '@/utils/router'
import { Actions } from '@/utils/store'
import { disable2FA } from '@/utils/api/auth'

import NavButton from '@/components/NavButton.vue'
import Setup2FAModal from '@/components/auth/Setup2FA.vue'
import Notification from '@/components/Notification.vue'

@Component({
  components: { NavButton, Setup2FAModal, Notification }
})
export default class Account extends Vue {
  // Default player while loading
  user: User = {
    _id: '',
    name: '',
    email: '',
    verified: false,
    creation: new Date(2020, 1, 1),
    use2FA: false,
    passed2FA: false
  }
  sessions: DeviceSession[] | null = null
  sessionsError: string = ''
  notification!: Notification

  mounted() {
    this.notification = (this.$refs.notification as Notification)
    // Set user id from path parameter
    this.user._id = getAuthUserId() || ''

    // Get the player
    this.$store.dispatch(Actions.GET_USER, { id: this.user._id })
      .then(user => this.user = user)
      .catch(err => console.warn(err))

    // Get device sessions
    this.getSessions()
  }

  getSessionDate(session: DeviceSession): string {
    return getDateTimeString(new Date(session.since), true)
  }

  getSessionExpirationDate(session: DeviceSession): string {
    const date: Date = new Date(session.since)
    const exp: number = date.getUTCMilliseconds() + session.expires
    return getDateTimeString(new Date(exp), true)
  }

  /**
   * Retrieve device sessions from API
   */
  getSessions() {
    this.sessionsError = ''
    API.getDeviceSessions()
      .then(res => {
        this.sessionsError = ''
        this.sessions = res.sessions
      })
      .catch(err => {
        this.sessionsError = 'Device sessions cannot be loaded right now. Please try again later.'
        console.warn(err)
      })
  }

  on2FAClick(done: () => void) {
    this.user.use2FA ? this.disable2FA(done) : this.enable2FA(done)
  }

  /**
   * Disable 2FA via API
   */
  disable2FA(done: () => void): void {
    disable2FA()
      .then(_ => {
        // Update UI
        this.user.use2FA = false
        this.notification.notify('2FA disabled!')
      })
      .catch(err => this.notification.notify(err.message, false))
      .finally(done)
  }

  /**
   * Enable 2FA via API
   */
  enable2FA(done: () => void): void {
    const modal = (this.$refs.setup2FAModal as Setup2FAModal)
    modal.start()
    done()
  }

  /**
   * View account recovery codes
   * TODO
   */
  viewCodes(done: () => void): void {
    // TODO: modal
    done()
  }

  /**
   * Revoke a session using its hash
   */
  revokeSession(done: () => void, hash: string): void {
    API.revokeSession(hash)
      .then(this.getSessions)
      .catch(err => this.sessionsError = 'Failed to delete session: ' + err.message)
      .finally(done)
  }

  /**
   * Send the logout request, clear data, and go to the main page
   */
  logout(): void {
    logout()
    this.$router.push(PageRoutes(Pages.MAIN))
      .catch(err => console.warn('$router.push: ' + err))
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/colors';
@import '../../style/vars';

#account {
  ._2fa-enabled {
    font-weight: bold;
    color: red;
    &.enabled {
      color: green;
    }
  }
  .device-session {
    margin-bottom: 1rem;
    padding: $m1 $m2;
    border-radius: .3rem;
    background-color: #fafafa;
    box-shadow: 0 .2rem .5rem #00000022;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    .info {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: self-start;
      .icon {
        width: 3rem;
        display: none;
        margin: $m2 $m2 0 0;
      }
      .details {
        .device {
          margin: 0;
        }
        .ip, .expires {
          font-family: monospace;
          margin-top: $m1;
        }
        .location {
          border-top: 1px solid #00000033;
          font-size: .9rem;
        }
      }
    }
    .session-revoke {
      flex-shrink: 0;
      width: initial;
      margin-top: $m0;
    }
  }
}

@media screen and (min-width: $screen-size-1) {
  #account {
    .device-session {
      .info {
        .icon {
          display: inline-block;
        }
      }
    }
  }
}

@media screen and (min-width: $screen-size-2) {
  #account {
    .device-session {
      flex-direction: row;
      .info {
        margin-right: $m2;
      }
    }
  }
}
</style>
