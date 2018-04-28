<template>
  <div class="wrapDiv">
    <!-- <div class="title" @click="test()">show</div>

    <el-collapse-transition>
      <div v-show="show['show0']" class="animation"></div>
    </el-collapse-transition> -->

    <step-plugin></step-plugin>

  </div>
</template>

<script>
import stepPlugin from './step_plugin'

export default {
  name: 'user',
  components: {
    stepPlugin
  },
  data () {
    return {
      show: {show0: false}
    }
  },
  methods: {
    test () {
      // show['show0'] = !show['show0']
      this.show['show0'] = !this.show['show0']
      console.log(this.show['show0'])
    }
  }
}
</script>

<style lang="stylus" scoped>
.wrapDiv
  margin-top 100px

.title
  width 200px
  height 40px
  background-color black
  margin 0 auto

.animation
  margin 0 auto
  width 200px
  height 100px
  background-color rgba(111, 111, 111, 1)
</style>
