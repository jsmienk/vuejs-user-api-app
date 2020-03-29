<template>
<transition name="modal">
  <div v-show="show" class="modal-bkg">
    <div class="modal">
      <header v-if="showHeader">
        <h3>{{ title }}</h3>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer v-if="showFooter">
        <NavButton @click-load="(done) => { done(); show = false }">{{ closeText }}</NavButton>
      </footer>
    </div>
  </div>
</transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import NavButton from '@/components/NavButton.vue'

@Component({
  components: { NavButton }
})
export default class Modal extends Vue {
  @Prop() title!: string
  @Prop({ default: 'Close' }) closeText!: string
  @Prop({ default: true }) showHeader!: boolean
  @Prop({ default: true }) showFooter!: boolean

  show: boolean = false

  public open() {
    this.show = true
  }

  public close() {
    this.show = false
  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars';
@import '../style/colors';

$animation-flow: .3s ease;

.modal-bkg {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity $animation-flow;
}

.modal {
  margin: $padding-screen-0;
  width: 100%;
  border-radius: 1rem;
  background-color: $color-bkg-light;
  box-shadow: 0 .5rem 3rem rgba(0, 0, 0, .66);
  transition: all $animation-flow;

  header, footer {
    text-align: center;
    padding: $m1 $padding-screen-0;
  }

  header {
    border-bottom: 1px solid #ddd;

    h3 {
      margin: 0;
    }
  }

  main {
    overflow-y: scroll;
    height: 50vh;
    padding: 0;
    padding-left: $padding-screen-0;
    padding-right: $padding-screen-0;
  }

  footer {
    border-top: 1px solid #ddd;
  }
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal,
.modal-leave-active .modal {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>