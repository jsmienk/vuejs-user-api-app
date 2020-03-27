<template>
<main id="register" class="fullscreen">
  <h1>Register</h1>
  <!-- Instructions -->
  <p class="instructions">Register using a unique email address, a display name, and a strong password.</p>
  <!-- Register form -->
  <form>
    <!-- Email (unique) -->
    <TextInput class="form-spacing" label="Email address" type="email"
      @input="email = $event" @link="email$v = $event" required />
    <!-- Name (display) -->
    <TextInput class="form-spacing" label="Name" type="text"
      @input="dname = $event" @link="dname$v = $event" required />
    <!-- Password (min. length) -->
    <TextInput class="form-spacing" label="Password" type="password" :checkStrength="true"
      @input="passw = $event" @link="passw$v = $event" required />

    <div class="button-row form-spacing">
      <NavButton :to="Pages.MAIN" :active="true">Login</NavButton>
      <NavButton class="button-main" @click="onRegisterClick">Register</NavButton>
    </div>
  </form>

  <!-- Register error modal -->
  <ErrorModal :error="error" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Pages } from '@/utils/router'
import { Validation } from 'vuelidate'

import API from '@/utils/api'

import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import ErrorModal, { Error } from '@/components/ErrorModal.vue'

@Component({
  components: { TextInput, NavButton, ErrorModal }
})
export default class Register extends Vue {
  email: string = ''
  dname: string = ''
  passw: string = ''
  email$v!: Validation
  dname$v!: Validation
  passw$v!: Validation

  error: Error = { title: '', message: '' }

  data() { return { Pages } }

  onRegisterClick(): boolean {
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
              this.error = {
                title: 'Register Error',
                message: 'Invalid email or display name provided!'
              }
              break
            case 409:
              this.error = {
                title: 'Duplicate Email',
                message: 'This email address is already in use. Login or try to register with a different email address!'
              }
              break
          }
        })
    }
    return false
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/colors';
@import '../../style/vars';

#register {
  text-align: center;
}
</style>