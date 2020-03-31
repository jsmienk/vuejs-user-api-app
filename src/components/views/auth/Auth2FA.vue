<template>
<Modal ref="modal" class="centered" :title="$t('pages.auth2fa.title')">
  <form>
    <p>{{ $t('pages.auth2fa.instructions') }}</p>

    <TextInput type="code" :label="$t('pages.auth2fa.input.label.otp')"
      @input="otp = $event" @link="otp$v = $event" required />

    <NavButton class="button-main form-spacing" @click-load="onCodeSubmit">{{ $t('pages.auth2fa.button.submit') }}</NavButton>

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
  $refs!: { modal: Modal }
  otp: string = ''
  badOTP: boolean = false
  otp$v!: Validation

  errorText: string = ''

  open() {
    this.otp$v.$reset()
    this.otp = ''
    this.errorText = ''
    this.$refs.modal.open()
  }

  onCodeSubmit(done: () => void) {
    this.errorText = ''
    this.otp$v.$touch()
    if (!this.otp$v.$invalid) {
      verify2FA(this.otp)
        .then(user => this.$emit('success', user))
        .catch(err => this.errorText = this.$t('error.api.invalid_otp') as string)
        .finally(done)
    } else {
      done()
      this.errorText = this.$t('pages.auth2fa.error.otp_length') as string
    }
  }
}
</script>
