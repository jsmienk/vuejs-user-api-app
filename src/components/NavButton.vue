// https://router.vuejs.org/api/#router-link

<template>
  <span class="button">
    <router-link class="internal" v-if="active" :to="toRaw">
      <slot></slot>
    </router-link>
    <a class="internal" v-if="!active" href="#" @click="$emit('click', $event)">
      <slot></slot>
    </a>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Pages, PageRoutes } from '@/utils/router'

@Component
export default class Register extends Vue {
  @Prop() to!: Pages
  @Prop() args!: [any]
  @Prop() active!: boolean

  get toRaw(): string {
    return PageRoutes(this.to, this.args)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/colors';

.button {
  display: inline-block;
  width: 100%;
  border-radius: .3rem;
  text-decoration: none;
  text-transform: uppercase;
  text-align: center;
  font-size: 1rem;

  .internal {
    padding: .3rem 1.8rem;
    width: 100%;
    display: inline-block;
  }

  &.button-main {
    background-color: $color-btn-main;
  }

  &.button-2nd {
    background-color: $color-btn-2nd;
  }

  &.button-warn {
    background-color: $color-btn-warn;
    color: $color-text-light;
  }
}
</style>