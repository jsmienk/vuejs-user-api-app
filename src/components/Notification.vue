<template>
<Modal ref="modal" class="notification" :show-footer="false" :show-header="false">
  <div @click="close">
    <h4>Notification</h4>
    <img v-if="positive" src="@/assets/noti_pos.svg" class="icon" />
    <img v-if="!positive" src="@/assets/noti_neg.svg" class="icon" />
    <p>{{ text }}</p>
  </div>
</Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/Modal.vue'

@Component({
  components: { Modal }
})
export default class Notification extends Vue {
  text: string = 'Success'
  positive: boolean = true
  handler: number | undefined = undefined

  modal!: Modal

  mounted() {
    this.modal = this.$refs.modal as Modal
  }

  public notify(text: string, positive: boolean=true, duration: number=1500): void {
    this.text = text
    this.positive = positive
    // Open modal and close it after the duration
    this.modal.open()
    this.handler = setTimeout(this.close, duration)
  }

  close() {
    window.clearTimeout(this.handler)
    this.modal.close()
  }
}
</script>

<style lang="scss">
.notification {
  .modal {
    text-align: center;
    width: 20rem;
    main {
      height: initial;
    }
    .icon {
      width: 50%;
    }
  }
}
</style>