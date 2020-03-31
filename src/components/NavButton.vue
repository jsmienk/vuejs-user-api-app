// https://router.vuejs.org/api/#router-link

<template>
  <span class="button">
    <router-link class="internal" v-if="active" :to="toRaw">
      <slot></slot>
    </router-link>
    <a class="internal" :class="{ loading }" v-if="!active" href="#" @click.prevent="onClick">
      <span v-if="loading" v-t="'button_loading'" />
      <span v-if="!loading"><slot></slot></span>
    </a>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Pages, PageRoutes } from '@/utils/router'

@Component
export default class NavButton extends Vue {
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

<style lang="sass" scoped>
@use 'src/style'
@use 'src/style/colors'

.button
  display: inline-flex
  align-items: center
  width: 100%
  padding: 0
  background-color: colors.$btn-2nd
  border-radius: .3rem
  text-transform: uppercase
  text-align: center
  font-size: 1rem
  word-break: normal

  .internal
    padding: .3rem 1.8rem
    width: 100%
    display: inline-block
    text-decoration: none

    &.loading
      opacity: .5

  &.button-main
    background-color: colors.$btn-main

  &.button-warn
    background-color: colors.$btn-warn
    color: colors.$text-light
  
  &.button-small, &.button-tiny
    width: initial
    border-radius: .2rem

  &.button-small
    font-size: .9rem
    .internal
      padding: .2rem 1rem .1rem

  &.button-tiny
    font-size: .8rem
    .internal
      padding: .1rem 1rem 0
</style>
