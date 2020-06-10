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
          <i class="voting_content_vote_item_i">{{item.voteId}}号</i>

          <img :src="toImg(item.imgUrl)" class="voting_content_vote_item_img" />
          <div class="voting_content_vote_item_title">
            <i class="voting_content_vote_item_i_after">{{item.voteCount}}票</i>
            <div class="voting_content_vote_item_title_left">
              <p>{{item.voteOption}}</p>
              <i
                :class="item.status? 'voting_content_vote_item_title_left_before':'voting_content_vote_item_title_left_after'"
                @click="voting(item)"
              >{{item.status?'投票':'已投票'}}</i>
            </div>
            <img v-show="vote" />
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  data () {
    return {
      listTitle: {},
      tableId: '',
      userIndex: '',
      vote: true,
      url: '',
      listData: [],
      formData: {},
      openId: '',
      orderFieldList: ['voteId', 'voteOption', 'communityId', 'imgUrl']
    }
  },

  mounted () {
    let dataList = []

    this.userIndex = this.$route.query.userIndex
    this.tableId = this.$route.query.tableId
    this.openId = this.$route.query.openId
    this.url = '/api/v4/forms/' + this.tableId + '/responses'

    let infoData = {}
    infoData.openid = this.openId
    infoData.tableId = this.tableId

    api.getVoteListAPI().then(res => {
      this.listTitle = res.data[this.userIndex]
      let DataTime = this.listTitle.created_at
      let firstDataTime = DataTime.slice(0, 10)
      let lastDataTime = DataTime.slice(11, 19)
      DataTime = firstDataTime + ' ' + lastDataTime
      this.listTitle.DataTime = DataTime
    })
    api.getVotingAPI(this.url).then(res => {
      // 数据结构解析
      let data = res.data

      for (let i = 0; i < res.data.length; i++) {
        let dataObj = {}
        this.orderFieldList.forEach(element => {
          let value = data[i].mapped_values[element].exported_value[0]
          dataObj[element] = value
          dataObj.status = true
          dataObj.voteCount = 0
        })
        dataList.push(dataObj)
      }

      // 查看投票状态
      api.postVoteInfoAPI(infoData).then(res => {
        if (res.data.errcode === 0) {
          this.vote = false
          for (let i = 0; i < dataList.length; i++) {
            if (res.data.data.options[i + 1]) {
              dataList[i].voteCount = res.data.data.options[i + 1]
            }
          }
          let voteId = res.data.data.voteId
          dataList[voteId - 1].status = false
        }
      })
      this.listData = dataList
    })
  },
  methods: {
    // 投票状态切换
    voting (item) {
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
        this.$toast.fail('已投票')
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
      this.formData.communityId = item.communityId
      this.formData.tableName = item.tableName
      this.formData.voteId = item.voteId
      this.formData.voteOption = item.voteOption
      this.formData.tableId = this.tableId
      this.formData.openid = this.openId
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
    font-size: 13px;
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
      position: relative;
      margin: 5px;
      width: 47%;
      background: #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
      border-radius: 2px;
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
        padding: 6px;
        width: 90%;
      }
      .voting_content_vote_item_title {
        position: relative;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #2e2e2e;
        letter-spacing: 0;
        padding: 6px;
        line-height: 24px;
        display: flex;
        text-align: left;
        justify-content: space-between;

        .voting_content_vote_item_title_left {
          width: 100%;
          text-align: center;

          .voting_content_vote_item_title_left_before {
            background: #2196f0;
            border-radius: 4px;
            border-radius: 4px;
            color: #fff;
            width: 90%;
            margin: 20px auto 0px;
            display: inline-block;
            text-align: center;
            font-size: 16px;
            line-height: 26px;
          }

          .voting_content_vote_item_title_left_after {
            background: #ccc;
            border-radius: 4px;
            border-radius: 4px;
            color: #fff;
            width: 90%;
            margin: 20px auto 0px;
            display: inline-block;
            text-align: center;
            font-size: 16px;
            line-height: 26px;
          }
        }

        p {
          font-family: PingFangSC-Medium;
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

        .voting_content_vote_item_i_after {
          position: absolute;
          top: -26px;
          right: 8px;
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
}
</style>
