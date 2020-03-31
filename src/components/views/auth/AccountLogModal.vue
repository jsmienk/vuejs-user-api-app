<template>
<Modal ref="modal" class="account-log-modal" :title="$t('pages.account_log.title')">
  <h3>{{ $t('pages.account_log.info', { n: !!logs ? logs.length : 0 }) }}</h3>
  <!-- State messages -->
  <p v-if="!logs" v-t="'loading'" />
  <p v-if="!!logs && logs.length === 0" v-t="'pages.account_log.error.no_logs'" />
  <!-- Logs -->
  <div class="account-log card" v-for="log in logs" :key="log._id">
    <h4>
      <span class="type" v-t="'pages.account_log.type.' + log.type" />
      <!-- Date -->
      <span class="date monospace">{{ getDateTimeString(new Date(log.date), true) }}</span>
    </h4>
    <!-- IP & location -->
    <div class="ip monospace">{{ log.ip }}</div>
    <div class="location">{{ log.location || $t('unknown_location') }}</div>
  </div>
</Modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getDateTimeString } from '@/utils/helpers'
import { AccountLog } from '@/utils/api/models'
import API, { ErrorCodes } from '@/utils/api'

import Modal from '@/components/modals/Modal.vue'


@Component({
  components: { Modal }
})
export default class AccountLogModal extends Vue {
  $refs!: { modal: Modal }
  logs: AccountLog[] | null = null

  data() { return { getDateTimeString } }

  public open() {
    this.getAccountLogs()
    this.$refs.modal.open()
  }

  getAccountLogs(): void {
    API.getAccountLogs()
      .then(res => this.logs = res.logs)
      .catch((code: ErrorCodes) => this.$emit('error', code))
  }
}
</script>

<style lang="sass" scoped>
@use 'src/style/spacing'
@use 'src/style/colors'

.account-log-modal
  .modal
    main  
      .account-log
        margin-bottom: spacing.$m2
        h4
          margin: 0
          display: flex
          justify-content: space-between
          flex-wrap: wrap
          .type
            margin-right: spacing.$m1
          .date
            font-size: 1.2rem
        .ip
          margin-top: spacing.$m1
        .location
          border-top: 1px solid colors.$border
          display: inline-block
          line-height: 1.7
          font-size: .8rem
</style>
