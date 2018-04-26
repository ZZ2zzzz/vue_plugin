<template>
  <div id="wrapDiv">
    <el-card class="box-card">

      <p class="title">流程进度</p>

      <el-steps :active="3" finish-status="success">
        <el-step title="已报送" :description="description">asdadasd</el-step>
        <el-step title="已研判"></el-step>
        <el-step title="已复核"></el-step>
        <el-step title="处置"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <hr class="divide">

      <p class="title">操作日志</p>

      <div class="logButton">
        <span>批复中...</span>
      </div>

      <el-card v-for="content in contentData" :key="content.id"
        class="box-card detail-card" shadow="hover">
        <el-collapse>
          <el-collapse-item name="step-detail">
            <template slot="title">
              <p class="coll-title">{{ content.title }}</p>
              <p class="coll-date">{{ content.date }}</p>
            </template>
            <div class="pop">
              <p class="pop-title">{{ content.nameTitle }}</p>
              <p class="pop-content">{{ content.name }}</p>
              <p class="pop-title">{{ content.intentTitle }}</p>
              <p class="pop-content">{{ content.intent }}</p>
              <p class="pop-title">{{ content.textTitle }}</p>
              <p class="pop-content">{{ content.text }}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

    </el-card>

  </div>
</template>

<script>
export default {
  name: 'step-plugin',
  data () {
    return {
      active0: '',
      active1: '',
      active2: '',
      contentData: [],
      description: `淮安-张小强\n2018.03.13`
    }
  },
  created () {
    let contentData = [
      {
        id: 1,
        title: '报送',
        date: '2018.03.13',
        nameTitle: '报送人',
        name: '淮安-张小强',
        intentTitle: '报送意向',
        intent: '已阅',
        textTitle: '报送正文',
        text: '报送方法基本可行，请领导予以指示'
      },
      {
        id: 2,
        title: '研判',
        date: '2018.03.15',
        nameTitle: '研判人',
        name: '民警-童小佳',
        intentTitle: '研判意向',
        intent: '已阅',
        textTitle: '研判正文',
        text: '研判方法基本可行，请领导予以指示'
      },
      {
        id: 3,
        title: '复核',
        date: '2018.03.17',
        nameTitle: '复核人',
        name: '科长-郭冬青',
        intentTitle: '复核意向',
        intent: '已阅',
        textTitle: '复核正文',
        text: '复核方法基本可行，请领导予以指示'
      }
    ]
    this.contentData = contentData.reverse()
  }
}
</script>

<style lang="stylus" scoped>
$title-font-size = 16px
$content-font-size = 12px

$pop-font-size = 14px

$blue-color = rgba(24, 144, 255, 1)

set-opacity(opacity)
  return rgba(0, 0, 0, opacity)

#wrapDiv
  margin 0 auto
  width 60%

  .title
    font-size $title-font-size
    font-weight bold
    line-height 24px
    color set-opacity(.75)

.el-steps--horizontal
  margin-top 20px

.detail-card
  margin-top 24px
  .el-collapse
    border-top 0

.coll-apse-nav
  border 1px solid red
  position relative
  top 20px

.nav-title
  font-size $title-font-size

.nav-content
  font-size $content-font-size

.coll-title
  height 36px
  line-height 56px
  font-size $title-font-size
  color set-opacity(.75)

.coll-date
  height 36px
  line-height 26px
  font-size $content-font-size
  color set-opacity(.45)

.pop-title
  margin-top 12px
  border-left 4px solid $blue-color
  font-size $pop-font-size
  height $pop-font-size
  line-height $pop-font-size
  font-weight bold
  padding-left 8px
  color set-opacity(.85)

.pop-content
  margin-top 12px
  font-size $pop-font-size
  color set-opacity(.65)
  padding-left 12px

.divide
  margin 27px 0 24px 0
  border-top set-opacity(.2)

.logButton
  width 88px
  height 32px
  background-color $blue-color
  margin-top 24px
  margin-bottom 4px

  span
    margin auto auto
    display inline-block
    width 100%
    height 100%
    color rgba(255, 255, 255, 1)
    font-size $pop-font-size
    text-align center
    line-height 32px

</style>
