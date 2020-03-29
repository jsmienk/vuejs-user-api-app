<template>
<main id="login" class="fullscreen">
  <h1>Login</h1>
  <div class="login-card">
    <!-- Instructions -->
    <p class="instructions">Login using your registered email address, and password.</p>
    <!-- Login form -->
    <form>
      <!-- Email -->
      <TextInput label="Email address" type="email"
        @input="email = $event" @link="email$v = $event" required />
      <!-- Password -->
      <TextInput class="form-spacing" label="Password" type="password"
        @input="passw = $event" @link="passw$v = $event" required />

      <div class="button-row form-spacing">
        <NavButton :to="Pages.REGISTER" :active="true">Register</NavButton>
        <NavButton class="button-main" @click-load="onLoginClick">Login</NavButton>
      </div>

      <!-- Request password reset -->
      <NavButton class="form-spacing">Forgot password?</NavButton>
    </form>
  </div>

  <!-- 2FA modal -->
  <Auth2FAModal ref="modalAuth2FA" @success="goToAccount" />

  <!-- Login error modal -->
  <ErrorModal :error="error" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { Pages, PageRoutes } from '@/utils/router'
import { login, getAuthUserId } from '@/utils/api/auth'

import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import ErrorModal, { Error } from '@/components/ErrorModal.vue'
import Auth2FAModal from '@/components/auth/Auth2FA.vue'

@Component({
  components: { TextInput, NavButton, ErrorModal, Auth2FAModal }
})
export default class Main extends Vue {
  email: string = ''
  passw: string = ''
  email$v!: Validation
  passw$v!: Validation

  error: Error = { title: '', message: '' }

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
            (this.$refs.modalAuth2FA as Auth2FAModal).open()
          else 
            // Go to account
            this.goToAccount()
        })
        .catch(err => this.error = { title: 'Login Error', message: 'Invalid credentials were provided!' })
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
}
</script>

<style lang="scss" scoped>
@import '../../style/colors';
@import '../../style/vars';

#login {
  text-align: center;
}
</style>
