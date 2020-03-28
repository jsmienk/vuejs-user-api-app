<template>
<Modal class="modal-error" ref="modal" :title="error.title">
  <p>{{ error.message }}</p>
  <p>Please try again.</p>
</Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Modal from '@/components/Modal.vue'

export interface Error {
  title: string,
  message: string
}

@Component({
  components: { Modal }
})
export default class ErrorModal extends Vue {
  @Prop({ default: { title: '', message: '' } }) error!: Error

  @Watch('error')
  onErrorChanged() {
    (this.$refs.modal as Modal).open()
  }
}
</script>