// https://router.vuejs.org/api/#router-link

<template>
  <span class="button">
    <router-link class="internal" v-if="active" :to="toRaw">
      <slot></slot>
    </router-link>
    <a class="internal" :class="{ loading }" v-if="!active" href="#" @click="onClick">
      <span v-if="loading">. . .</span>
      <span v-if="!loading"><slot></slot></span>
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

  loading: boolean = false

  get toRaw(): string {
    return PageRoutes(this.to, this.args)
  }

  onClick(): void {
    if (this.loading) return
    this.loading = true
    this.$emit('click-load', () => this.loading = false)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/colors';

.button {
  display: inline-block;
  width: 100%;
  background-color: $color-btn-2nd;
  border-radius: .3rem;
  text-transform: uppercase;
  text-align: center;
  font-size: 1rem;
  .internal {
    padding: .3rem 1.8rem;
    width: 100%;
    display: inline-block;
    text-decoration: none;
    &.loading {
      opacity: .5;
      
    }
  }
  &.button-main {
    background-color: $color-btn-main;
  }
  &.button-warn {
    background-color: $color-btn-warn;
    color: $color-text-light;
  }
}
</style>