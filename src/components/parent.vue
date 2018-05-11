<template>
  <div>
    <child>
      <h1 slot="header">Here is header.</h1>
      <p slot="footer">Here is footer.</p>
    </child>
  </div>
</template>

<script>
import child from './child'
// import { mapState } from 'vuex'

export default {
  data () {
    return {
      count: 1
    }
  },
  components: {
    child
  },
  mounted () {
    console.log(this.$store.state.count)
    this.$store.commit('increment')
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
</script>

<style lang="stylus" scoped>

</style>
