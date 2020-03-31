<template>
<div>
  <Modal id="setup-2fa" ref="modal" class="centered"
    :title="$t('pages.setup2fa.title')" :close-text="$t('pages.setup2fa.close')">
    <!-- Instructions -->
    <p>{{ $t('pages.setup2fa.instruction.0') }}</p>
    <p>{{ $t('pages.setup2fa.instruction.1') }}</p>
    <p>{{ $t('pages.setup2fa.instruction.2') }}</p>

    <!-- QR code -->
    <div class="qr-code">
      <img v-show="!!qrUrl" :src="qrUrl" class="qr-code" />
    </div>

    <!-- Manual key -->
    <p class="key">{{ key }}</p>

    <p>{{ $t('pages.setup2fa.instruction.3') }}</p>

    <form>
      <!-- Input code -->
      <TextInput type="code" :label="$t('pages.setup2fa.input.label.otp')"
        @input="otp = $event" @link="otp$v = $event" required />

      <!-- Submit button -->
      <NavButton class="button-main form-spacing" @click-load="onCodeSubmit">{{ $t('pages.setup2fa.button.submit') }}</NavButton>
    </form>
  </Modal>
  <Notification ref="notification" />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import QRCode from 'qrcode'
import API, { ErrorCodes } from '@/utils/api'
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
    this.key = this.$t('loading') as string
    this.$refs.modal.open()
    API.prepare2FA()
      .then(res => {
        this.key = res.key2FA
        QRCode.toDataURL(res.registration)
          .then((url: string) => this.qrUrl = url)
          .catch(console.warn)
      })
      .catch((code: ErrorCodes) => {
        this.$refs.modal.close()
        this.$refs.notification.notify('pages.setup2fa.notification.fail', false)
      })
  }

  onCodeSubmit(done: () => void) {
    this.otp$v.$touch()
    if (!this.otp$v.$invalid) {
      verify2FA(this.otp)
        .then(user => {
          this.$refs.notification.notify('pages.setup2fa.notification.success', true, 1500)
          this.$refs.modal.close()
          this.$emit('success')
        })
        .catch((code: ErrorCodes) => {
          switch (code) {
            case ErrorCodes.TIMEOUT:
              return this.$refs.notification.notify('error.api.timeout', false)
            case ErrorCodes.UNAUTHORIZED:
              return this.$refs.notification.notify('error.api.invalid_otp', false)
          }
          return this.$refs.notification.notify('error.api.unknown', false)
        })
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