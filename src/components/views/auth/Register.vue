<template>
<main id="register" class="slim fullscreen centered">
  <h1>Register</h1>
  <!-- Instructions -->
  <p class="instructions">Register using a unique email address, a display name, and a strong password.</p>
  <!-- Register form -->
  <form>
    <!-- Email (unique) -->
    <TextInput class="form-spacing" label="Email address" type="email"
      @input="email = $event" @link="email$v = $event" autocomplete="email" required />
    <!-- Name (display) -->
    <TextInput class="form-spacing" label="Name" type="text"
      @input="dname = $event" @link="dname$v = $event" autocomplete="username" required />
    <!-- Password (min. length) -->
    <TextInput class="form-spacing" label="Password" type="password" :checkStrength="true"
      @input="passw = $event" @link="passw$v = $event" autocomplete="new-password" required />

    <div class="button-row form-spacing">
      <NavButton :to="Pages.MAIN" :active="true">Login</NavButton>
      <NavButton class="button-main" @click-load="onRegisterClick">Register</NavButton>
    </div>
  </form>

  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Pages } from '@/utils/router'
import { Validation } from 'vuelidate'

import API from '@/utils/api'

import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import Notification from '@/components/Notification.vue'

@Component({
  components: { TextInput, NavButton, Notification }
})
export default class Register extends Vue {
  $refs!: { notification: Notification }
  email: string = ''
  dname: string = ''
  passw: string = ''
  email$v!: Validation
  dname$v!: Validation
  passw$v!: Validation

  data() { return { Pages } }

  onRegisterClick(done: () => void): boolean {
    this.email$v.$touch()
    this.dname$v.$touch()
    this.passw$v.$touch()
    if (!this.email$v.$invalid && !this.dname$v.$invalid && !this.passw$v.$invalid) {
      API.createUser(this.email, this.dname, this.passw)
        .then(_ => {
          alert('User was successfully created!')
        })
        .catch(err => {
          switch (err.code) {
            case 400:
              this.$refs.notification.notify('Invalid email or display name provided!', false)
              break
            case 409:
              this.$refs.notification.notify('This email address is already in use. Login or try to register with a different email address!', false)
              break
          }
        })
        .finally(done)
    } else done()
    return false
  }
}
</script>
