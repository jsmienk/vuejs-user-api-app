<template>
<main id="account" class="fullscreen screen-padding">
    <h1>{{ user.name }}</h1>
    <p>{{ user._id }}</p>
</main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Actions } from '@/utils/store'
import { User } from '@/utils/api/models'

@Component
export default class Profile extends Vue {
  // Default player while loading
  user: User = {
    _id: '',
    player: '',
    name: '',
    email: '',
    verified: false,
    creation: new Date(2020, 1, 1),
    use2FA: false,
    passed2FA: false
  }

  mounted() {
    // Set user id from path parameter
    this.user._id = this.$route.params.id

    // Get the player
    this.$store.dispatch(Actions.GET_USER, { id: this.user._id })
      .then(user => this.user = user)
      .catch(err => console.warn(err))
  }
}
</script>

<style lang="scss">
@import '../../style/colors';
@import '../../style/vars';

#account {}
</style>
