<template>
<Modal ref="modal" class="confirmation" :show-footer="false" :title="title">
  <div class="confirmation-container">
    <p class="question">{{ question }}</p>
    <div class="button-row middle">
      <NavButton class="positive button-main button-small" v-if="!!positiveText"
        @click-load="$event(); onOptionClick(Confirmation.POSITIVE)">{{ positiveText }}</NavButton>
      <NavButton class="neutral  button-2nd  button-small" v-if="!!neutralText"
        @click-load="$event(); onOptionClick(Confirmation.NEUTRAL) ">{{ neutralText }}</NavButton>
      <NavButton class="negative button-warn button-small" v-if="!!negativeText"
        @click-load="$event(); onOptionClick(Confirmation.NEGATIVE)">{{ negativeText }}</NavButton>
    </div>
  </div>
</Modal>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import Modal from '@/components/modals/Modal.vue'
import NavButton from '@/components/NavButton.vue'

export enum Confirmation {
  POSITIVE,
  NEUTRAL,
  NEGATIVE
}

@Component({
  components: { Modal, NavButton }
})
export default class ConfirmModal extends Vue {
  $refs!: { modal: Modal }
  title: string = ''
  question: string = ''
  positiveText: string | null = null
  neutralText : string | null = null
  negativeText: string | null = null
  callback: () => void = () => { console.warn('No done callback was passed to ConfirmModal') }

  data() { return { Confirmation } }

  public confirm(title: string, question: string, done: () => void,
    positiveText?: string, neutralText?: string, negativeText?: string): void {
      this.callback = done
      this.title    = (this.$te(title)    ? this.$t(title) as string    : title)    || this.$t('notification.confirmation.title_default') as string
      this.question = (this.$te(question) ? this.$t(question) as string : question) || this.$t('notification.confirmation.question_default') as string
      this.positiveText = !!positiveText && this.$te(positiveText) ? this.$t(positiveText) as string : null
      this.neutralText  = !!neutralText  && this.$te(neutralText)  ? this.$t(neutralText)  as string : null
      this.negativeText = !!negativeText && this.$te(negativeText) ? this.$t(negativeText) as string : null
      this.$refs.modal.open()
  }

  onOptionClick(answer: Confirmation): void {
    this.$emit('answer', answer, this.callback)
    this.$refs.modal.close()
  }
}
</script>

<style lang="sass">
@use 'src/style/spacing'

.confirmation
  .modal
    text-align: center
    width: initial

    main
      max-width: 100vw
      width: initial
      height: initial
      .confirmation-container
        padding-bottom: spacing.$m2
        .question
          max-width: 300px
          margin: spacing.$m3 auto
</style>