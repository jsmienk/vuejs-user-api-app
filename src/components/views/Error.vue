<template>
<main class="error-page fullscreen centered">
    <div class="error-head">
        <span class="error-status">{{ code }}</span>
        <span class="error-title">{{ title }}</span>
    </div>
    <p class="error-message">{{ message }}</p>
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Error extends Vue {
    code: number = 404
    
    data() {
      return {
        title: this.$t('pages.error.404.title'),
        message: this.$t('pages.error.404.message')
      }
    }
}
</script>

<style lang="sass" scoped>
@use 'src/style/colors'

.error-page
  width: 100%

  .error-head
    position: relative
    margin-top: 100px

    .error-status
      line-height: 1.2
      font-size: 24vw
      font-weight: bold
      color: colors.$error-code

    .error-title
      position: absolute
      top: 55%
      left: 20%
      font-size: 8vw
      font-weight: bold

  .error-message
    display: inline-block
    max-width: 80%
</style>
