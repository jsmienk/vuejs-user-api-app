<script lang="ts">
import { Vue, Mixins, Component, Prop } from 'vue-property-decorator'
import { validationMixin, Validation } from 'vuelidate'
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import { testStrength } from '@/utils/api/passwords'
import _ from 'lodash'

enum InputType {
  EMAIL='email',
  TEXT='text',
  PASS='password',
  CODE='code'
}

@Component({
  validations: { 
    other: { required },
    code: { maxLength: maxLength(7), numeric, required }
  }
})
export default class TextInput extends Mixins(validationMixin) {
  @Prop()                 label!: string
  @Prop()                 type!: InputType
  @Prop()                 required!: boolean
  @Prop({default: false}) checkStrength!: boolean
  @Prop()                 autocomplete!: string

  passwordStrength: number = 0
  other: string = ''
  code: string = ''

  data() {
    return {
      InputType,
      throttleInput: _.debounce(this.onInput, 200, { maxWait: 400 })
    }
  }

  get input(): string {
    return this.type === InputType.CODE ? this.code : this.other
  }

  get validator(): Validation | undefined {
    return this.type === InputType.CODE ? this.$v.code : this.$v.other
  }

  get isError(): boolean {
    return !!this.validator && this.validator.$error
  }

  get placeholderText(): string {
    return this.isError ? this.$t('error.input.required') as string : ''
  }

  mounted() {
    this.$emit('link', this.validator)
  }

  onInput(e: any) {
    const text = e.target.value
    // Check password strength
    if (this.type === InputType.PASS) {
      if (text.length === 0) {
        this.passwordStrength = 0
      } else {
        testStrength(text)
          .then(strength => this.passwordStrength = strength)
          .catch(console.warn)
      }
    }
    this.$emit('input', text)
  }

  get passwordStrengthStyle(): string {
    // Always show a little bit of red (min of .05)
    return `
      width: ${Math.min(Math.max(.05, this.passwordStrength), 1) * 100}%;
      background-color: ${this.getPasswordStrengthColor(this.passwordStrength)}
    `
  }

  getPasswordStrengthColor(strength: number): string {
    if (strength < .30) return 'red'
    if (strength < .90) return 'orange'
    return 'greenyellow'
  }
}
</script>

<template>
<div>
  <div class="text-input" :class="{ 'text-input--error': isError }">
    <!-- Label -->
    <label v-if="label">{{ label }}</label>

    <!-- Input -->
    <input v-if="type !== InputType.CODE"
      v-model.trim="$v.other.$model"
      :type="type"
      :placeholder="placeholderText"
      :class="{ 'show-strength': checkStrength }"
      @input="throttleInput"
      :autocomplete="autocomplete" />

    <!-- Code input -->
    <input v-if="type === InputType.CODE"
      v-model.trim="$v.code.$model"
      type="text"
      minlength="6"
      maxlength="7"
      class="type-code"
      @input="throttleInput"
      autocomplete="one-time-code" />

    <!-- Password strength bar -->
    <div v-if="checkStrength" class="password-strength">
      <div class="password-strength-bar" :style="passwordStrengthStyle" />
    </div>
  </div>
  <!-- Password strength source disclaimer -->
  <p v-if="checkStrength" class="password-strength-source">
    Password strength tested using <a href="https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange" rel="noopener noreferrer">HaveIBeenPwned</a>.
  </p>
</div>
</template>

<style lang="sass" scoped>
@use 'src/style'
@use 'src/style/colors'

.text-input
  border-radius: style.$border-radius
  box-shadow: 0 0 1px #bbb

  label, input
    display: block
    width: 100%
    color: colors.$text
    text-align: initial

  label
    font-size: .9em
    padding: 1px 8px 0
    border-radius: style.$border-radius style.$border-radius 0 0
    background-color: colors.$border

  input
    outline: none  // prevents browser's default focus indication
    padding: 4px 8px
    border-radius: 0 0 style.$border-radius style.$border-radius
    background-color: colors.$background

    &.type-code
      font-size: 1.1rem
      text-align: center
      letter-spacing: .5rem

    &.show-strength
      border-radius: 0

    &::placeholder
      color: colors.$text-warn

  input, .password-strength
    border: 1px solid colors.$border

  .password-strength
    height: 6px
    border-radius: 0 0 style.$border-radius style.$border-radius
    border-top: none
    overflow: hidden

    .password-strength-bar
      height: 100%

  &:focus-within
    // box-shadow: 0 0 3px 1px #2299ff   LOOKS LIKE MACOS DEFAULT
    box-shadow: 0 0 3px 1px #2299ff88

  &.text-input--error
    animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both
    transform: translate3d(0, 0, 0)
    backface-visibility: hidden
    perspective: 1000px

.password-strength-source
  text-align: left
  font-size: .8rem
  margin: .3rem


@keyframes shake
  10%, 90%
    transform: translate3d(-1px, 0, 0)
  
  20%, 80% 
    transform: translate3d(2px, 0, 0)

  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0)

  40%, 60%
    transform: translate3d(4px, 0, 0)
</style>