<template>
<Modal ref="modal" class="centered" title="Two-Factor Authentication">
  <form>
    <p>Please enter a One-Time-Password from your registered authenticator application.</p>

    <TextInput type="code" label="One-Time-Password"
      @input="otp = $event" @link="otp$v = $event" required />

    <NavButton class="button-main form-spacing" @click-load="onCodeSubmit">Submit Code</NavButton>

    <p class="text-error">{{ errorText }}</p>
  </form>
</Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { verify2FA } from '@/utils/api/auth'

import Modal from '@/components/Modal.vue'
import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'

@Component({
  components: { Modal, TextInput, NavButton }
})
export default class Auth2FA extends Vue {
  otp: string = ''
  badOTP: boolean = false
  otp$v!: Validation

  errorText: string = ''

  open() {
    this.otp$v.$reset()
    this.otp = ''
    this.errorText = ''
    ;(this.$refs.modal as Modal).open()
  }

  onCodeSubmit(done: () => void) {
    this.errorText = ''
    this.otp$v.$touch()
    if (!this.otp$v.$invalid) {
      verify2FA(this.otp)
        .then(user => this.$emit('success', user))
        .catch(err => this.errorText = 'Invalid One-Time-Password. Please try again.')
        .finally(done)
    } else {
      done()
      this.errorText = 'One-Time-Password consists of 6 or 7 digits.'
    }
  }
}
</script>
