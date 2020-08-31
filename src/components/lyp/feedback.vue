<template>
  <div>
    <div class="banner">
      <div class="banner_title">
        <h1 class="banner_title_h1">我的反馈</h1>
        <p class="banner_title_p">Feedback</p>
      </div>
      <img alt class="tickling_img" src="https://source2.softspirit.cn/wsq/hd_fb.jpg" />
    </div>
<!--    <div class="tickling_main">-->
      <!-- <van-list
        :finished="finished"
        :immediate-check="immediate_check"
        @load="onLoad"
        finished-text="没有更多了"
        v-model="loading"
      > -->
    <van-collapse v-model="activeNames" :key="item.id" class="tickling_main_center" v-for="item in list">
      <van-collapse-item class="titleCollapse" :title="item.type" :name="item.id">
        <van-steps :active="item.active" direction="vertical">
          <van-step>待领取<span class="stepTime">{{item.createTime}}</span></van-step>
          <van-step>处理中</van-step>
          <van-step>完结</van-step>
          <van-step>退单</van-step>
          <van-step>转派天阙</van-step>
          <van-step>天阕处理完成</van-step>
        </van-steps>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data: function () {
    return {
      list: [],
      loading: false,
      finished: false,
      immediate_check: false,
      loadNum: 1,
      name: '',
      callNumber: '',
      activeNames: ['200']
    }
  },
  mounted () {
    let query = this.$route.query
    this.name = query.name || window.name || ''
    this.phone = query.phone || window.phone || ''
    let json = {
      'pageNum': this.loadNum,
      'pageSize': '30',
      'name': this.name,
      'callNumber': this.phone
    }
    // api.postFeedBackListAPI(json).then(res => {
    //   if (res.status === 200) {
    //     this.list = res.data.data.list
    //     if (!this.list) {
    //       this.$toast(res.data.resultDetail)
    //     }
    //   }
    // })
    api.postFeedBackListAPI(json).then((res) => {
      if (res.status === 200) {
        this.list = res.data.data.list
        if (!this.list) {
          this.$toast(res.data.resultDetail)
        }
      }
      this.list.forEach((el) => {
        switch (el.type1) {
          case "1": {
            el.type = "咨询";
            break;
          }
          case "2": {
            el.type = "投诉";
            break;
          }
          case "3": {
            el.type = "求助";
            break;
          }
          case "4": {
            el.type = "建议";
            break;
          }
          case "5": {
            el.type = "意见";
            break;
          }
          case "6": {
            el.type = "其他";
            break;
          }
          case "7": {
            el.type = "治安隐患";
            break;
          }
          default: {
          }
        }
        switch (el.status) {
          case "0": {
            el.active = 0;
            break;
          }
          case "1": {
            el.active = 1;
            break;
          }
          case "2": {
            el.active = 2;
            break;
          }
          case "3": {
            el.active = 3;
            break;
          }
          case "5": {
            el.active = 4;
            break;
          }
          case "7": {
            el.active = 5;
            break;
          }
          default: {
          }
        }
      });
    });
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    // 分页器
    onLoad () {
      this.loadNum++
      this.loading = true
      let json = {
        'pageNum': this.loadNum,
        'pageSize': '30'
      }
      api.postFeedBackListAPI(json).then(res => {
        if (res.status === 200) {
          let oldList = this.list
          let newList = res.data.data.list
          this.list = [...oldList, ...newList]
          this.loading = false

          if (!res.data) {
            this.loading = false
            this.finished = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabnar-header {
  text-align: center;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  height: 50px;
  line-height: 50px;
}
.after {
  position: absolute;
  left: 10px;
}
.after:after {
  border-top: 5px solid #555555;
  border-bottom: 5px solid transparent;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: '';
  display: inline-block;
  transform: rotate(90deg);
  position: relative;
  width: 0;
}
.tickling_img {
  width: 100%;
  height: 120px;
}

.banner {
  position: relative;
  .banner_title {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
    color: white;

    .banner_title_h1 {
      text-align: left;
      font-size: 20px;
    }
    .banner_title_p {
      color: #de7c6d;
      text-align: left;
      font-size: 13px;
    }
  }
}
.van-collapse-item{
  width: 100%;
}
.stepTime{
  display: inline-block;
  padding-left: 20px;
}
.tickling_main {
  border-radius: 8px;
  background: #fff;
  height: 520px;
  position: absolute;
  width: 100%;
  top: 114px;
}

.tickling_main_center {
  display: flex;
  margin: 0px 20px;
  padding: 10px 0px;
  border-bottom: 1px solid #f4f4f5;
}

.tickling_main_left {
  background: #2196f3;
  width: 40px;
  height: 40px;
  border-radius: 6px;
}

.tickling_main_right {
  margin-left: 16px;
  width: 100%;

  h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 500;
  }
  h3 {
    margin-top: 8px;
    text-align: left;
    color: #95a4b3;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 1.5px;
    word-break: break-word;
  }
  p {
    margin-top: 8px;
    display: flex;
    text-align: left;
    color: #95a4b3;
    justify-content: space-between;

    span {
      padding: 2px 8px;
      border-radius: 12px;
      background: #f4f4f8;
    }
  }

  .tickling_main_right_reply {
    margin-top: 20px;
  }
  .in_head {
    color: #ffc637;
    background: #fff9ec;
  }
  .end {
    color: #2196f3;
    background: #e8f4fd;
  }
}
</style>
