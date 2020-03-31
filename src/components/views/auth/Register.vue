<template>
<main id="register" class="slim fullscreen centered">
  <h1>{{ $t('pages.register.title') }}</h1>
  <!-- Instructions -->
  <p class="instructions">{{ $t('pages.register.instructions') }}</p>
  <!-- Register form -->
  <form>
    <!-- Email (unique) -->
    <TextInput class="form-spacing" :label="$t('pages.register.input.label.email')" type="email"
      @input="email = $event" @link="email$v = $event" autocomplete="email" required />
    <!-- Name (display) -->
    <TextInput class="form-spacing" :label="$t('pages.register.input.label.name')" type="text"
      @input="dname = $event" @link="dname$v = $event" autocomplete="username" required />
    <!-- Password (min. length) -->
    <TextInput class="form-spacing" :label="$t('pages.register.input.label.password')" type="password" :checkStrength="true"
      @input="passw = $event" @link="passw$v = $event" autocomplete="new-password" required />

    <div class="button-row form-spacing">
      <NavButton :to="Pages.MAIN" :active="true">{{ $t('pages.register.button.go_login') }}</NavButton>
      <NavButton class="button-main" @click-load="onRegisterClick">{{ $t('pages.register.button.register') }}</NavButton>
    </div>
  </form>

  <Notification ref="notification" />
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Pages } from '@/utils/router'
import { Validation } from 'vuelidate'

import API, { ErrorCodes } from '@/utils/api'

import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import Notification, { Duration } from '@/components/modals/Notification.vue'

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
        .then(_ => this.$refs.notification.notify('pages.register.notification.success', true, Duration.SHORT))
        .catch((code: ErrorCodes) => {
          switch (code) {
            case ErrorCodes.TIMEOUT:
              return this.$refs.notification.notify('error.api.timeout', false)
            case ErrorCodes.BAD_REQUEST:
              return this.$refs.notification.notify('error.api.invalid_register', false)
            case ErrorCodes.CONFLICT:
              return this.$refs.notification.notify('error.api.duplicate_register', false)
          }
          return this.$refs.notification.notify('error.api.unknown', false)
        })
        .finally(done)
    } else done()
    return false
  }
}
</script>
