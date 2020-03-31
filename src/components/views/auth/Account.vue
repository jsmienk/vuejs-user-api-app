<template>
<main id="account" class="screen-padding">
  <!-- General user info -->
  <h1>{{ user.name }}</h1>
  <h3 class="user-id">{{ user._id }}</h3>
  <h3 class="user-email" v-if="user.email">{{ user.email }}</h3>
  <NavButton class="button-warn" @click-load="onLogoutClick">{{ $t('pages.account.button.logout') }}</NavButton>

  <!-- 2FA -->
  <h3 v-t="'pages.account.heading._2fa'" />
  <p v-t="'pages.account.text._2fa_info'" />
  <i18n path="pages.account.text._2fa_status" tag="p" :for="_2FAI18nKey">
    <span class="highlight" :class="{ negative: !user.use2FA }">{{ $t(_2FAI18nKey) }}</span>
  </i18n>
  <!-- Enable/disable -->
  <div class="button-row">
    <NavButton @click-load="viewCodes" v-if="user.use2FA">{{ $t('pages.account.button.show_2fa_codes') }}</NavButton>
    <NavButton @click-load="user.use2FA ? onDisable2FAClick($event) : onEnable2FAClick($event)">{{ $t(`pages.account.button.${user.use2FA ? 'disable' : 'enable'}_2fa`) }}</NavButton>
  </div>

  <!-- Device sessions -->
  <h3 v-t="'pages.account.heading.sessions'" />
  <p v-t="'pages.account.text.session_info'" />
  <!-- Loading/error messages -->
  <p v-if="sessions === null" v-t="'loading'" />
  <p v-if="!!sessions && sessions.length === 0" v-t="'pages.account.error.no_sessions'" />
  <!-- Session list -->
  <div class="device-session card" v-for="session in sessions" :key="session._id">
    <h4 class="device">{{ session.platform }} {{ session.application }}</h4>
    <div class="details">
      <div class="left">
        <!-- Icon -->
        <img class="icon" src="@/assets/devices.svg" />
        <!-- Revoke button -->
        <NavButton class="button-warn button-tiny" @click-load="revokeSession($event, session.hash)">{{ $t('pages.account.button.revoke_session') }}</NavButton>
      </div>
      <!-- Text details -->
      <div class="right">
        <!-- IP & location -->
        <div class="ip monospace">{{ session.ip }}</div>
        <div class="location">{{ session.location || $t('unknown_location') }}</div>
        <!-- Since & expiration dates -->
        <div class="since monospace">{{ getSessionDate(session) }}</div>
        <div class="expires monospace">{{ getSessionExpirationDate(session) }}</div>
      </div>
    </div>
  </div>

  <!-- Account event log -->
  <h3 v-t="'pages.account.heading.event_log'" />
  <p v-t="'pages.account.text.event_log_info'" />
  <NavButton class="button-2nd" @click-load="showEventLog">{{ $t('pages.account.button.show_event_log') }}</NavButton>

  <!-- Delete account -->
  <h3 v-t="'pages.account.heading.deletion'" />
  <p v-t="'pages.account.text.deletion_info'" />
  <NavButton class="button-warn" @click-load="onDeleteClick">{{ $t('pages.account.button.delete') }}</NavButton>

  <!-- Acount event log modal -->
  <AccountLogModal ref="accountLogModal" />
  <!-- Setup 2FA modal -->
  <Setup2FAModal ref="setup2FAModal" @success="user.use2FA = true" />
  <!-- Confirmation moda -->
  <ConfirmModal ref="confirmModal" @answer="onDeleteConfirmation" />
  <!-- Notification modal -->
  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getDateTimeString } from '@/utils/helpers'
import { User, DeviceSession } from '@/utils/api/models'
import API, { ErrorCodes } from '@/utils/api'
import { getAuthUserId, disable2FA, logout } from '@/utils/api/auth'
import { Pages, PageRoutes } from '@/utils/router'
import { Actions } from '@/utils/store'

import NavButton from '@/components/NavButton.vue'
import Setup2FAModal from '@/components/views/auth/Setup2FA.vue'
import AccountLogModal from '@/components/views/auth/AccountLogModal.vue'
import Notification, { Duration } from '@/components/modals/Notification.vue'
import ConfirmModal, { Confirmation } from '@/components/modals/ConfirmModal.vue'

@Component({
  components: { NavButton, Setup2FAModal, Notification, AccountLogModal, ConfirmModal }
})
export default class Account extends Vue {
  $refs!: {
    notification: Notification,
    setup2FAModal: Setup2FAModal,
    accountLogModal: AccountLogModal,
    confirmModal: ConfirmModal
  }
  user: User = {
    _id: '',
    name: '',
    email: '',
    verified: false,
    creation: '',
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

  /**
   * Disable 2FA via API
   */
  onDisable2FAClick(done: () => void): void {
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
  onEnable2FAClick(done: () => void): void {
    this.$refs.setup2FAModal.open()
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
   * Show a modal with the account event logs
   */
  showEventLog(done: () => void): void {
    this.$refs.accountLogModal.open()
    done()
  }

  /**
   * Send the logout request, clear data, and go to the main page
   */
  onLogoutClick(): void {
    logout()
    this.$router.push(PageRoutes(Pages.MAIN))
      .catch(err => console.warn('$router.push: ' + err))
  }

  /**
   * Delete account
   */
  onDeleteClick(done: () => void): void {
    this.$refs.confirmModal.confirm(
      'pages.account.confirmation.delete.title',
      'pages.account.confirmation.delete.question',
      done,
      'pages.account.confirmation.delete.positive',
      undefined,
      'pages.account.confirmation.delete.negative')
  }

  onDeleteConfirmation(answer: Confirmation, done: () => void): void {
    switch (answer) {
      case Confirmation.NEGATIVE:  // DELETE
        API.removeUserById(this.user._id)
          .then(this.onLogoutClick)
          .catch((err: ErrorCodes) => {
            if (err === ErrorCodes.TIMEOUT)
              this.$refs.notification.notify('error.api.timeout', false)
            else
              this.$refs.notification.notify('pages.account.error.fail_delete_account', false)
            done()
          })
        break
      case Confirmation.POSITIVE:  // CANCEL  (fallthrough)
      default: done()
    }
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
    width: 100%
    .device
      margin: 0
    .details
      display: flex
      justify-content: space-between
      align-items: flex-end      

      .left
        flex-shrink: 0
        display: flex
        flex-direction: column
        align-items: center
        margin-right: spacing.$m1
        .icon
          width: 3rem
          margin-bottom: spacing.$m2
        .session-revoke
          margin-top: spacing.$m0

      .right
        flex-grow: 1
        .since, .expires, .location, .ip
          margin-left: spacing.$m1
          line-height: 1.7
        .since, .ip
          margin-top: spacing.$m1
        .expires, .location
          display: inline-block
          border-top: 1px solid colors.$border
        .location
          font-size: .8rem
</style>
