<template>
<div class="error-page">
    <div class="error-head">
        <span class="error-status">{{ code }}</span>
        <span class="error-title">{{ title }}</span>
    </div>
    <p class="error-message">{{ message }}</p>
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Error extends Vue {
    code: number = 404
    title: string = 'Page Not Found'
    message: string = 'This page could not be found. The page may have moved, or we redirected you wrongly, or the URL was spelled wrongly.'
}
</script>

<style lang="scss" scoped>
@import '../../style/colors';

.error-page {
    text-align: center;

    .error-head {
        position: relative;
        margin-top: 100px;

        .error-status {
            line-height: 1.2;
            font-size: 24vw;
            font-weight: bold;
            color: $color-error-code;
        }

        .error-title {
            position: absolute;
            top: 55%;
            left: 20%;
            font-size: 8vw;
            font-weight: bold;
        }
    }

    .error-message {
        display: inline-block;
        max-width: 80%;
    }
}
</style>
