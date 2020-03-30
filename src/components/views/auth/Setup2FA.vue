<template>
<div>
  <Modal id="setup-2fa" ref="modal" class="centered" title="Two-Factor Authentication" close-text="Cancel">
    <!-- Instructions -->
    <p>To enable 2FA, follow these steps:</p>
    <p>1. Open any authenticator application (e.g. Authy and Google Authenticator).</p>
    <p>2. Scan the QR-code or manually enter the key to register this service to the authenticator application.</p>

    <!-- QR code -->
    <div class="qr-code">
      <img v-show="!!qrUrl" :src="qrUrl" class="qr-code" />
    </div>

    <!-- Manual key -->
    <p class="key">{{ key }}</p>

    <p>3. Confirm the registration by submitting the One-Time-Password.</p>

    <form>
      <!-- Input code -->
      <TextInput type="code" label="One-Time-Password"
        @input="otp = $event" @link="otp$v = $event" required />

      <!-- Submit button -->
      <NavButton class="button-main form-spacing" @click-load="onCodeSubmit">Submit Code</NavButton>
    </form>
  </Modal>
  <Notification ref="notification" />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import QRCode from 'qrcode'
import API from '@/utils/api'
import { verify2FA } from '@/utils/api/auth'

import Modal from '@/components/Modal.vue'
import TextInput from '@/components/TextInput.vue'
import NavButton from '@/components/NavButton.vue'
import Notification from '@/components/Notification.vue'

@Component({
  components: { Modal, TextInput, NavButton, Notification }
})
export default class Setup2FAModal extends Vue {
  $refs!: {
    modal: Modal
    notification: Notification
  }
  otp: string = ''
  otp$v!: Validation
  qrUrl: string = ''
  key: string = ''

  public start() {
    this.otp = ''
    this.qrUrl = ''
    this.key = 'Loading...'
    this.$refs.modal.open()
    API.prepare2FA()
      .then(res => {
        this.key = res.key2FA
        QRCode.toDataURL(res.registration)
          .then((url: string) => this.qrUrl = url)
          .catch(console.warn)
      })
      .catch(err => {
        this.$refs.modal.close()
        this.$refs.notification.notify('2FA cannot be enabled right now. Please try again later.', false)
      })
  }

  onCodeSubmit(done: () => void) {
    this.otp$v.$touch()
    if (!this.otp$v.$invalid) {
      verify2FA(this.otp)
        .then(user => {
          this.$refs.notification.notify('2FA is successfully enabled!', true, 1500)
          this.$refs.modal.close()
          this.$emit('success')
        })
        .catch(err => this.$refs.notification.notify('Invalid One-Time-Password. Please try again.', false))
        .finally(done)
    } else done()
  }
}
</script>

<style lang="sass">
@use 'src/style/spacing'

#setup-2fa
  .qr-code
    background-color: #00000011
    margin: 0 auto
    width: 12rem
    height: 12rem

  .key
    font-family: monospace
    font-weight: bold
    font-size: 1.3rem

  .modal main
    padding-bottom: spacing.$m3
</style>