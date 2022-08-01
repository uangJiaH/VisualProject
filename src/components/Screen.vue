<template>
  <div :style="containerStyle" class="screen-container">
    <header class="screen-header">
      <div><img :src="borderSrc" alt=""></div>
      <span class="logo"> <img :src="logoSrc" alt=""/> </span> <span class="title">电商平台实时监控系统</span>
      <div class="title-right"><img :src="themeSrc" class="qiehuan" @click="changeTheme"> <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { getThemeValue } from '@/utils/theme_utils'
export default {
  computed: {
    ...mapState(['theme']),
    borderSrc () {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    logoSrc () {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
