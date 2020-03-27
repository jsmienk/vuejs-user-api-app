<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
@import '~sanitize.css';
@import '~sanitize.css/forms.css';
@import '~sanitize.css/typography.css';

@import 'style/colors';
@import 'style/vars';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-text;
}

// SCREEN SIZE 0

main {
  padding: $padding-screen-0;
  width: $width-screen-0;
  margin: 0 auto;

  &.fullscreen {
    height: 100vh;
  }

  form {
    .form-spacing {
      margin-top: $m2;
    }
  }
}

.button-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .button {
    margin-right: $m2;
  
    &:last-child {
      margin-right: 0;
    }
  }
}

.text-error {
  color: red;
}
</style>
