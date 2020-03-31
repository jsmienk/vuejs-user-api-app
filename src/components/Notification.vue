<template>
<Modal ref="modal" class="notification" :show-footer="false" :show-header="false">
  <div @click="close">
    <h4>{{ $t('notification.title') }}</h4>
    <img v-if="positive" src="@/assets/noti_pos.svg" class="icon" />
    <img v-if="!positive" src="@/assets/noti_neg.svg" class="icon" />
    <p>{{ text }}</p>
  </div>
</Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/Modal.vue'

export enum Duration {
  SHORT=1500,
  NORMAL=2500,
  LONG=2500
}

@Component({
  components: { Modal }
})
export default class Notification extends Vue {
  @Prop({ default: Duration.NORMAL }) duration!: number

  $refs!: { modal: Modal }
  text: string = ''
  positive: boolean = true
  handler?: number

  public notify(text: string, positive: boolean=true, duration?: Duration): void {
    // Try to use the text as a localization key
    this.text = (this.$te(text) ? this.$t(text) as string : text) || this.$t('notification.msg_default') as string
    this.positive = positive
    // Open modal and close it after the duration
    this.$refs.modal.open()
    this.handler = window.setTimeout(this.close, duration || this.duration)
  }

  close() {
    window.clearTimeout(this.handler)
    this.$refs.modal.close()
  }
}
</script>

<style lang="sass">
@use 'src/style/colors'

.notification
  .modal
    text-align: center
    width: 20rem

    main
      width: 100%
      overflow: hidden
      height: initial

    .icon 
      width: 6rem
      height: 6rem
</style>