<template>
<main id="login" class="slim fullscreen centered">
  <h1>Login</h1>
  <div class="login-card">
    <!-- Instructions -->
    <p class="instructions">Login using your registered email address, and password.</p>
    <!-- Login form -->
    <form>
      <!-- Email -->
      <TextInput label="Email address" type="email" autocomplete="email"
        @input="email = $event" @link="email$v = $event" required />
      <!-- Password -->
      <TextInput class="form-spacing" label="Password" type="password" autocomplete="current-password"
        @input="passw = $event" @link="passw$v = $event" required />

      <div class="button-row form-spacing">
        <NavButton :to="Pages.REGISTER" :active="true">Register</NavButton>
        <NavButton class="button-main" @click-load="onLoginClick">Login</NavButton>
      </div>

      <!-- Request password reset -->
      <NavButton class="form-spacing" @click-load="onForgotPasswordClick">Forgot password?</NavButton>
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
        .catch(err => {
          switch(err.code) {
            case 0:
              this.$refs.notification.notify('Could not load response in time!', false)
              break
            case 401:
              this.$refs.notification.notify('Invalid credentials provided!', false)
              break
          }
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
