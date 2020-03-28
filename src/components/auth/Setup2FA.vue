<template>
<div>
  <Modal ref="modal" class="setup-2fa" title="Two-Factor Authentication">
    <!-- Instructions -->
    <p>To enable 2FA, follow these steps:</p>
    <p>1. Open any authenticator application (e.g. Authy and Google Authenticator).</p>
    <p>2. Scan the QR-code or manually enter the key to register this service to the authenticator application.</p>

    <!-- QR code -->
    <img v-show="!!qrUrl" :src="qrUrl" class="qr-code" />

    <!-- Manual key -->
    <p class="key">{{ key }}</p>

    <p>3. Confirm the registration by submitting the One-Time-Password.</p>

    <form>
      <!-- Input code -->
      <TextInput type="code" label="One-Time-Password"
        @input="otp = $event" @link="otp$v = $event" required />

      <!-- Submit button -->
      <NavButton class="button-main form-spacing" @click="onCodeSubmit">Submit Code</NavButton>
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
  modal!: Modal
  notification!: Notification
  otp: string = ''
  otp$v!: Validation
  qrUrl: string = ''
  key: string = '0000 0000 0000 0000 0000 0000 0000 0000'

  mounted() {
    this.modal = this.$refs.modal as Modal
    this.notification = this.$refs.notification as Notification
  }

  public start() {
    this.modal.open()
    API.prepare2FA()
      .then(res => {
        this.key = res.key2FA
        QRCode.toDataURL(res.registration)
          .then((url: string) => this.qrUrl = url)
          .catch(console.warn)
      })
      .catch(err => {
        this.modal.close()
        this.notification.notify('2FA cannot be enabled right now. Please try again later.', false, 3000)
      })
  }

  onCodeSubmit() {
    this.otp$v.$touch()
    if (!this.otp$v.$invalid) {
      verify2FA(this.otp)
        .then(user => {
          this.notification.notify('2FA is successfully enabled!', true, 1500)
          this.modal.close()
          this.$emit('success')
        })
        .catch(err => this.notification.notify('Invalid One-Time-Password. Please try again.', false, 2500))
    }
  }
}
</script>

<style lang="scss">
@import "../../style/vars";

.setup-2fa {
  text-align: center;
  .qr-code {
    width: 12rem;
    height: 12rem;
  }
  .key {
    font-family: monospace;
    font-weight: bold;
  }
  .modal main {
    padding-bottom: $m3;
  }
}
</style>