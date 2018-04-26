<template>
  <div class="wrapDiv">
    <step-plugin></step-plugin>
  </div>
</template>

<script>
import stepPlugin from './step_plugin'

export default {
  name: 'user',
  components: {
    stepPlugin
  }
}
</script>

<style lang="stylus" scoped>
.wrapDiv
  margin 100px auto
</style>
