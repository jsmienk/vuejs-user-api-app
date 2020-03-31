<template>
<main id="login" class="slim fullscreen centered">
  <h1>{{ $t('pages.login.title') }}</h1>
  <div class="login-card">
    <!-- Instructions -->
    <p class="instructions">{{ $t('pages.login.instructions') }}</p>
    <!-- Login form -->
    <form>
      <!-- Email -->
      <TextInput :label="$t('pages.login.input.label.email')" type="email" autocomplete="email"
        @input="email = $event" @link="email$v = $event" required />
      <!-- Password -->
      <TextInput class="form-spacing" :label="$t('pages.login.input.label.password')" type="password" autocomplete="current-password"
        @input="passw = $event" @link="passw$v = $event" required />

      <div class="button-row form-spacing">
        <NavButton :to="Pages.REGISTER" :active="true">{{ $t('pages.login.button.go_register') }}</NavButton>
        <NavButton class="button-main" @click-load="onLoginClick">{{ $t('pages.login.button.login') }}</NavButton>
      </div>

      <!-- Request password reset -->
      <NavButton class="form-spacing" @click-load="onForgotPasswordClick">{{ $t('pages.login.input.label.password') }}</NavButton>
    </form>
  </div>

  <!-- 2FA modal -->
  <Auth2FAModal ref="modalAuth2FA" @success="goToAccount" />
  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { Pages, PageRoutes } from '@/utils/router'
import { ErrorCodes } from '@/utils/api'
import { login, getAuthUserId } from '@/utils/api/auth'

import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import Notification from '@/components/Notification.vue'
import Auth2FAModal from '@/components/views/auth/Auth2FA.vue'

@Component({
  components: { TextInput, NavButton, Notification, Auth2FAModal }
})
export default class Main extends Vue {
  $refs!: {
    notification: Notification,
    modalAuth2FA: Auth2FAModal
  }
  email: string = ''
  passw: string = ''
  email$v!: Validation
  passw$v!: Validation

  data() { return { Pages } }

  onLoginClick(done: () => void): boolean {
    // input validation
    this.email$v.$touch()
    this.passw$v.$touch()
    if (!this.email$v.$invalid && !this.passw$v.$invalid) {
      // Login API call
      login(this.email, this.passw)
        .then(user => {
          // On success, check if the user has 2FA enabled
          if (user.use2FA)
            // Prompt OTP
            this.$refs.modalAuth2FA.open()
          else 
            // Go to account
            this.goToAccount()
        })
        .catch((code: ErrorCodes) => {
          switch(code) {
            case ErrorCodes.TIMEOUT:
              return this.$refs.notification.notify('error.api.timeout', false)
            case ErrorCodes.UNAUTHORIZED:
              return this.$refs.notification.notify('error.api.invalid_login', false)
          }
          return this.$refs.notification.notify('error.api.unknown', false)
        })
        .finally(done)
    } else done()
    return false
  }

  /**
   * Helper to navigate to the user account
   */
  goToAccount(): void {
    this.$router.push(PageRoutes(Pages.ACCOUNT))
      .catch(err => console.warn('$router.push: ' + err))
  }

  onForgotPasswordClick(done: () => void): void {
    // TODO
    done()
  }
}
</script>
