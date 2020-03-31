<template>
<main id="account" class="screen-padding">
  <!-- General user info -->
  <h1>{{ user.name }}</h1>
  <p class="user-id">{{ user._id }}</p>
  <p class="user-email" v-if="user.email">{{ user.email }}</p>
  <NavButton id="logout" @click-load="logout" class="button-warn">{{ $t('pages.account.button.logout') }}</NavButton>

  <!-- 2FA -->
  <h3>{{ $t('pages.account.heading._2fa') }}</h3>
  <i18n path="pages.account.text._2fa_status" tag="p" :for="_2FAI18nKey">
    <span class="highlight" :class="{ negative: !user.use2FA }">{{ $t(_2FAI18nKey) }}</span>
  </i18n>
  <!-- Enable/disable -->
  <div class="button-row">
    <NavButton @click-load="viewCodes" v-if="user.use2FA">{{ $t('pages.account.button.show_2fa_codes') }}</NavButton>
    <NavButton @click-load="on2FAClick">{{ $t(`pages.account.button.${user.use2FA ? 'disable' : 'enable'}_2fa`) }}</NavButton>
  </div>

  <!-- Device sessions -->
  <h3>{{ $t('pages.account.heading.sessions') }}</h3>
  <!-- Loading/error messages -->
  <p v-if="sessions === null">{{ $t('loading') }}</p>
  <p v-if="!!sessions && sessions.length === 0">{{ $t('pages.account.error.no_sessions') }}</p>
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
    <NavButton @click-load="revokeSession($event, session.hash)" class="button-warn session-revoke">{{ $t('pages.account.button.revoke_session') }}</NavButton>
  </div>

  <!-- Setup 2FA modal -->
  <Setup2FAModal ref="setup2FAModal" @success="user.use2FA = true" />
  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import API, { ErrorCodes } from '@/utils/api'
import { getDateTimeString } from '@/utils/helpers'
import { User, DeviceSession } from '@/utils/api/models'
import { getAuthUserId, logout } from '@/utils/api/auth'
import { Pages, PageRoutes } from '@/utils/router'
import { Actions } from '@/utils/store'
import { disable2FA } from '@/utils/api/auth'

import NavButton from '@/components/NavButton.vue'
import Setup2FAModal from '@/components/views/auth/Setup2FA.vue'
import Notification, { Duration } from '@/components/Notification.vue'

@Component({
  components: { NavButton, Setup2FAModal, Notification }
})
export default class Account extends Vue {
  $refs!: {
    notification: Notification,
    setup2FAModal: Setup2FAModal
  }
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

  get _2FAI18nKey(): string {
    return 'pages.account.text._2fa_' + (this.user.use2FA ? 'enabled' : 'disabled')
  }

  mounted() {
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
    API.getDeviceSessions()
      .then(res => this.sessions = res.sessions)
      .catch((code: ErrorCodes) => {
        if (code === ErrorCodes.TIMEOUT)
          return this.$refs.notification.notify('error.api.timeout', false)
        return this.$refs.notification.notify('pages.account.error.fail_sessions', false)
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
        this.$refs.notification.notify('pages.account.notification._2fa_disabled', true, Duration.SHORT)
      })
      .catch(err => this.$refs.notification.notify('pages.account.error.fail_disable_2fa', false))
      .finally(done)
  }

  /**
   * Enable 2FA via API
   */
  enable2FA(done: () => void): void {
    this.$refs.setup2FAModal.start()
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
      .then(_ => {
        this.getSessions()
        this.$refs.notification.notify('pages.account.notification.session_revoked', true, Duration.SHORT)
      })
      .catch(err => this.$refs.notification.notify('pages.account.error.fail_revoke_session', false))
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

<style lang="sass" scoped>
@use 'src/style'
@use 'src/style/colors'
@use 'src/style/spacing'
@use 'src/style/responsive'

#account
  .device-session
    margin-bottom: 1rem
    padding: spacing.$m1 spacing.$m2
    border-radius: style.$border-radius
    background-color: #fafafa
    box-shadow: 0 .2rem .5rem #00000022
    display: flex
    flex-direction: column
    justify-content: space-between
    align-items: flex-end

    .info
      width: 100%
      display: flex
      justify-content: flex-start
      align-items: self-start

      .icon
        width: 3rem
        margin: spacing.$m2 spacing.$m2 0 0

      .details
        .device
          margin: 0

        .ip, .expires
          font-family: monospace
          margin-top: spacing.$m1

        .location 
          border-top: 1px solid colors.$border
          font-size: .9rem

    .session-revoke 
      flex-shrink: 0
      width: initial
      margin-top: spacing.$m0

@media #{responsive.$break-0}
  #account
    .device-session
      .info
        .icon
          display: none

@media #{responsive.$break-1}
  #account
    .device-session
      .info
        .icon
          display: inline-block

@media #{responsive.$break-2}
  #account
    .device-session
      flex-direction: row

      .info
        margin-right: spacing.$m2
</style>
