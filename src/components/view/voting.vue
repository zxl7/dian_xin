<template>
  <div class="voting">
    <header class="voting_header">
      <h2>{{listTitle.title}}</h2>
      <h4>{{listTitle.DataTime}}</h4>
      <p>{{toText(listTitle.description)}}</p>
    </header>
    <aside class="voting_content">
      <p class="voting_p">
        <img alt class="voting_img" src="~@/assets/img/装饰左.png" />
        <span class="voting_span">活动投票</span>
        <img alt class="voting_img" src="~@/assets/img/装饰右.png" />
      </p>

      <div class="voting_content_vote">
        <div :key="item.id" class="voting_content_vote_item" v-for="item in listData">
          <i class="voting_content_vote_item_i">{{item.id}}号</i>
          <i class="voting_content_vote_item_i_bottom">{{item.voteCount}}票</i>

          <img :src="item.img_url" class="voting_content_vote_item_img" />
          <p class="voting_content_vote_item_p">{{item.name}}</p>
          <i
            :class="item.status? 'voting_content_vote_item_i_before':'voting_content_vote_item_i_after'"
            @click="voting(item)"
          >{{item.status?'投票':'已投票'}}</i>
          <img v-show="vote" />
        </div>
      </div>
    </aside>
    <van-popup :style="{ height: '30%',width:'70%' }" close-icon="close" closeable v-model="show">
      <p class="popup-title">未登录，是否登录 ？</p>
      <a class="popup-buttom" href="http://wsq.gxzzzx.cn/mobile/wsq/login">去登录</a>
    </van-popup>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  data () {
    return {
      show: false,
      listTitle: {},
      tableId: '',
      type: '',
      userIndex: '',
      vote: true,
      url: '',
      urlList: '',
      listData: [],
      formData: {},
      openid: '',
      mobile: '',
      orderFieldList: ['name', 'id', 'img']
    }
  },

  mounted () {
    this.userIndex = this.$route.query.userIndex
    this.tableId = this.$route.query.tableId
    this.type = this.$route.query.type
    this.openid = this.$route.query.openid
    this.mobile = this.$route.query.mobile
    this.url = '/api/v4/forms/' + this.tableId + '/responses'
    this.urlList = '/api/v4/tags/' + this.type + '/taggable_forms'

    let infoData = {}
    infoData.openid = this.openid
    infoData.tableId = this.tableId

    api.getVoteListAPI(this.urlList).then(res => {
      // console.log(res)

      this.listTitle = res.data[this.userIndex]
      let DataTime = this.listTitle.created_at
      let firstDataTime = DataTime.slice(0, 10)
      let lastDataTime = DataTime.slice(11, 19)
      DataTime = firstDataTime + ' ' + lastDataTime
      this.listTitle.DataTime = DataTime
    })

    let dataList = []

    api.getVotingAPI(this.url).then(res => {
      let data = res.data

      // 数据结构解析
      for (let i = 0; i < res.data.length; i++) {
        let objData = {}
        this.orderFieldList.forEach(element => {
          let value = data[i].mapped_values[element].exported_value[0]
          objData[element] = value
          objData.status = true
          objData.voteCount = 0
        })
        // 图片地址解析
        for (let y = 0; y < res.data[i].entries.length; y++) {
          if (res.data[i].entries[y].attachment) {
            let str = res.data[i].entries[y].attachment.download_url
            let url = str.slice(0, str.indexOf('?'))
            objData.img_url = url
          }
        }

        dataList.push(objData)
      }
      dataList.reverse()

      // 定义投票状态
      api.postVoteInfoAPI(infoData).then(res => {
        if (res.data.errcode === 0) {
          for (let i = 0; i < dataList.length; i++) {
            if (res.data.data.options[i + 1]) {
              dataList[i].voteCount = res.data.data.options[i + 1]
            }
          }
          if (res.data.data.voteId) {
            this.vote = false
            let voteId = res.data.data.voteId
            dataList[voteId - 1].status = false
          }
        }
      })
      this.listData = dataList
    })
    if (this.type === 3) {
      this.vote = false
    }
  },
  methods: {
    // 投票状态切换
    voting (item) {
      if (!this.mobile) {
        this.show = !this.show
      } else {
        if (this.vote) {
          item.voteCount++
          item.status = false
          this.vote = !this.vote
          this.createFormData(item)
          api.postVoteCreateAPI(this.formData).then(res => {
            if (res.data.errcode === 1) {
              this.$toast.fail('不能重复投票')
            } else {
              this.$toast.success('投票成功')
            }
          })
        } else {
          if (this.type === 3) {
            this.$toast.fail('投票已结束')
          } else {
            this.$toast.fail('已投票')
          }
        }
      }
    },
    // 删除html标签
    toText (text) {
      if (text) { return text.replace(/<[^>]+>/ig, ' ') }
    },
    toImg (text) {
      if (text) {
        return (text.slice(text.indexOf('（') + 1, text.indexOf('）')))
      }
    },
    // 构建传输数据
    createFormData (item) {
      this.formData.openid = this.openid
      this.formData.tableName = item.tableName
      this.formData.voteId = item.id
      this.formData.voteOption = item.name
      this.formData.tableId = this.tableId
    }
  }
}
</script>

<style lang="scss" scoped>
.voting_header {
  text-align: left;
  margin: 26px 15px 20px;

  h2 {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #2e2e2e;
    letter-spacing: 0;
  }
  h4 {
    margin: 16px auto;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #bcbcbc;
    letter-spacing: 0;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #2e2e2e;
    letter-spacing: 0;
    text-align: justify;
    line-height: 24px;
  }
}
.voting_content {
  min-height: 600px;
  padding-bottom: 100px;
  text-align: center;
  background: url('~@/assets/img/bg.png');
  background-size: cover;

  .voting_p {
    display: inline-block;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 24px;
    margin: 20px 80px;

    .voting_span {
      margin: 0px 8px;
    }
    .voting_img {
      width: 24px;
    }
  }
  .voting_content_vote {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .voting_content_vote_item {
      margin-bottom: 9px;
      box-sizing: border-box;
      position: relative;
      width: 45vw;
      height: 262px;
      padding: 6px;
      background: #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
      border-radius: 2px;

      .voting_content_vote_item_i {
        position: absolute;
        top: 10px;
        left: -1px;
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: center;
        background-image: linear-gradient(
          225deg,
          #fd0000 0%,
          rgba(193, 43, 0, 0.8) 100%
        );
        border-radius: 0px 8px 8px 0;
      }

      .voting_content_vote_item_img {
        width: 100%;
        max-width: 156px;
        height: 156px;
      }
      .voting_content_vote_item_p {
        text-align: left;
        margin-top: 8px;
        width: 100%;
        font-size: 16px;
        color: #2e2e2e;
        letter-spacing: 0;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 行数*/
        -webkit-box-orient: vertical;
      }

      .voting_content_vote_item_i_before {
        background: #2196f0;
        border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        width: 92.8%;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        position: absolute;
        bottom: 6px;
        left: 6px;
        line-height: 26px;
      }

      .voting_content_vote_item_i_after {
        background: #ccc;
        border-radius: 4px;
        border-radius: 4px;
        color: #fff;
        width: 92.8%;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        position: absolute;
        bottom: 6px;
        left: 6px;
        line-height: 26px;
      }

      .voting_content_vote_item_i_bottom {
        position: absolute;
        bottom: 96px;
        right: 0px;
        padding-left: 10px;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        text-align: right;
        background-image: linear-gradient(
          45deg,
          #45c7fa 0%,
          rgba(33, 150, 243, 0.8) 100%
        );
        border-radius: 70px 0px 0 0;
      }
    }
  }
}
.popup-title {
  display: flex;
  font-size: 14px;
  justify-content: center;
  margin-top: 15%;
}

.popup-buttom {
  width: 70%;
  border: 1px solid #4caf50;
  padding: 10px;
  margin: 20% auto 0px;
  border-radius: 4px;
  text-align: center;
  background: #4caf50;
  color: #fff;
  font-size: 16px;
  display: block;
}
</style>
