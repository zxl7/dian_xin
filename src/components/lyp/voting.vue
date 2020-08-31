<template>
  <div class="voting">
    <header class="voting_header">
      <p class="header_title">{{listTitle.title}}</p>
      <div class="header_main">
        <div class="header_time">
          <span>{{listTitle.DataTime}}</span>
          <span v-if="status === '进行中'" class="green">{{status}}</span>
          <span v-else-if="status === '已结束'" class="end">{{status}}</span>
        </div>
        <img :src="listTitle.imgSrc" alt="">
        <p>{{toText(listTitle.description)}}</p>
      </div>
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
          <i v-if="status === '已结束'" class="voting_content_vote_item_i_bottom">{{item.voteCount}}票</i>
          <i v-else-if="status === '进行中' && showVote" class="voting_content_vote_item_i_bottom">{{item.voteCount}}票</i>
          <img :src="item.img_url" class="voting_content_vote_item_img" />
          <p class="voting_content_vote_item_p">{{item.name}}</p>
          <i v-if="status === '进行中'" :class="item.status? 'voting_content_vote_item_i_before':'voting_content_vote_item_i_after'"
            @click="voting(item)">
            {{item.status?'投票':'已投票'}}
          </i>
          <i v-else-if="status === '已结束'" class="voting_content_vote_item_i_after" @click="end()">投票</i>
<!--          <img v-show="vote" />-->
        </div>
      </div>
    </aside>
    <van-popup
      :style="{ height: '200px',width:'70%' }"
      round
      close-icon="none"
      closeable
      v-model="show"
    >
      <div class="popup">
        <h1 class="popup_h1">提示</h1>
        <p class="popup_title">需要实名认证才能继续，是否前往登录？</p>
        <p class="popup_botton">
          <span class="noLogin" @click="show=false">取消</span>
          <a class="goLogin" href="http://wsq.gxzzzx.cn/mobile/wsq/login">确定</a>
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import api from "@/api/api";

export default {
  data() {
    return {
      showVote: false,
      show: false,
      listTitle: {},
      tableId: "",
      type: "",
      userIndex: "",
      status: '',
      vote: true,
      url: "",
      urlList: "",
      listData: [],
      formData: {},
      openid: "",
      mobile: "",
      orderFieldList: ["name", "id", "img"],
      integral: ''
    };
  },

  async mounted() {
    this.tableId = parseInt(this.$route.query.tableId);
    this.type = this.$route.query.type;
    this.mobile = this.$route.query.mobile;
    this.status = this.$route.query.status
    this.url = "/api/v4/forms/" + this.tableId + "/responses";
    this.urlList = "/api/v4/tags/" + this.type + "/taggable_forms";
    let infoData = {};
    infoData.tableId = this.tableId;
    await api.getUserAPI(this.mobile).then((res) => {
      let userInfo = res.data[0]
      infoData.openid = userInfo.openid;
    });
    await api.getVoteListAPI(this.urlList).then((res) => {
      res.data.forEach(item => {
        if (item.id === this.tableId) {
          this.listTitle = item
        }
      })
      this.listTitle.DataTime = this.dateFormat("YYYY-mm-dd", this.listTitle.created_at);
      this.listTitle.imgSrc = this.toImg(this.listTitle.description)
      document.title = this.listTitle.title;
      window.desc = this.listTitle.title;
    });
    let dataList = [];
    await api.getVotingAPI(this.url).then((res) => {
      let data = res.data;
      // 数据结构解析
      for (let i = 0; i < res.data.length; i++) {
        let objData = {};
        this.orderFieldList.forEach((element) => {
          let value = data[i].mapped_values[element].exported_value[0];
          objData[element] = value;
          objData.status = true;
          objData.voteCount = 0;
        });
        // 图片地址解析
        for (let y = 0; y < res.data[i].entries.length; y++) {
          if (res.data[i].entries[y].attachment) {
            let str = res.data[i].entries[y].attachment.download_url;
            let url = str.slice(0, str.indexOf("?"));
            objData.img_url = url;
          }
        }
        dataList.push(objData);
      }
      dataList.reverse();

      // 定义投票状态
      if (this.mobile) {
        api.postVoteInfoAPI(infoData).then((res) => {
          if (res.data.errcode === 0) {
            for (let i = 0; i < dataList.length; i++) {
              if (res.data.data.options[i + 1]) {
                dataList[i].voteCount = res.data.data.options[i + 1];
              }
            }
            if (res.data.data.voteId) {
              this.vote = false;
              this.showVote = true
              let voteId = res.data.data.voteId;
              dataList[voteId - 1].status = false;
            }
          }
        });
      }
      this.listData = dataList;
    });
    if (this.type === 3) {
      this.vote = false;
    }
  },
  methods: {
    end() {
      this.$toast('投票已结束')
    },
    //  重构时间（时间格式，时间）
    dateFormat(fmt, date) {
      date = date ? new Date(date) : new Date();
      var ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
      };
      return fmt;
    },
    // 投票状态切换
    voting(item) {
      this.showVote = true
      if (!this.mobile) {
        this.show = !this.show;
      } else {
        if (this.vote) {
          item.voteCount++;
          item.status = false;
          this.vote = !this.vote;
          this.createFormData(item);
          api.postVoteCreateAPI(this.formData).then((res) => {
            if (res.data.errcode === 1) {
              this.$toast.fail("不能重复投票");
            } else {
              let data = {
                "phone": this.mobile,
                "page_id": this.tableId,
                "type": "vote"
              }
              api.postUpBehavior(data).then(res => {
                console.log(res)
                if (res.meta.errcode === 0 && res.data.param) {
                  this.integral = res.data.param.integral
                }
              })
              this.$toast.success(`投票成功,积分${this.integral}`);
            }
          });
        } else {
          if (this.type === 3) {
            this.$toast.fail("投票已结束");
          } else {
            this.$toast.fail("已投票");
          }
        }
      }
    },
    // 删除html标签
    toText(text) {
      if (text) {
        return text.replace(/<[^>]+>/gi, " ");
      }
    },
    toImg(text) {
      text = text.slice(text.indexOf('src="') + 5);
      text = text.slice(0, text.indexOf('"'));
      return text;
    },
    // 构建传输数据
    createFormData(item) {
      this.formData.openid = this.openid;
      this.formData.tableName = item.tableName;
      this.formData.voteId = item.id;
      this.formData.voteOption = item.name;
      this.formData.tableId = this.tableId;
    },
  },
};
</script>

<style lang="scss" scoped>
.voting_header {
  text-align: left;
  margin: 26px 15px 20px;

  .header_title {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    color: #000000;
  }
  .header_main{
    .header_time{
      padding: 14px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #E9EAEB;
      margin-bottom: 16px;
      span:first-child{
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
        color: #6B7885;
        margin-top: 4px;
      }
      span:last-child{
        padding: 0 8px;
        border-radius: 12px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 20px;
        text-align: center;
        flex: none;
        order: 0;
        align-self: center;
      }
      .green{
        background-color: #68C635;
        color: #FFFFFF;
      }
      .end{
        background-color: #F4F4F8;
        color: #95A4B3;
      }
    }
    img{
      width: 100%;
      height: 168px;
      object-fit: cover;
    }
    p {
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 27px;
      text-align: justify;
      color: #313C56;
      margin: 16px 0 36px;
    }
  }
}
.voting_content {
  min-height: 600px;
  padding-bottom: 100px;
  text-align: center;
  background: url("~@/assets/img/bg.png");
  background-size: cover;

  .voting_p {
    display: inline-block;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 24px;
    margin: 28px 80px 25px;

    .voting_span {
      margin: 0px 8px;
      font-weight: 600;
      font-size: 18px;
      line-height: 24px;
      text-align: justify;
    }
    .voting_img {
      width: 24px;
    }
  }
  .voting_content_vote {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .voting_content_vote_item {
      margin-bottom: 9px;
      box-sizing: border-box;
      position: relative;
      width: 44vw;
      //height: 219px;
      padding: 8px;
      background: #ffffff;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
      border-radius: 2px;
      .voting_content_vote_item_i {
        position: absolute;
        top: 10px;
        left: 8px;
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
        max-width: 149px;
        height: 149px;
        object-fit: cover;
      }
      .voting_content_vote_item_p {
        text-align: left;
        margin: 8px 0;
        width: 100%;
        font-size: 16px;
        line-height: 22px;
        color: #2e2e2e;
        letter-spacing: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 行数*/
        -webkit-box-orient: vertical;
      }

      .voting_content_vote_item_i_before {
        background: #2196F3;
        border-radius: 4px;
        color: #FFFFFF;
        width: 100%;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        line-height: 32px;
      }

      .voting_content_vote_item_i_after {
        background: #F4F4F8;
        border-radius: 4px;
        color: rgba(49, 60, 86, 0.2);
        width: 100%;
        display: inline-block;
        text-align: center;
        font-size: 16px;
        line-height: 32px;
      }

      .voting_content_vote_item_i_bottom {
        position: absolute;
        top: 134px;
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

.popup {
  padding: 20px;
}
.popup_h1 {
  margin-top: 20px;
  text-align: left;
}
.popup_title {
  margin-top: 5%;
  display: flex;
  font-size: 14px;
}

.popup_botton {
  margin-top: 10%;
  display: flex;
  justify-content: flex-end;
  margin-right: 10%;
  .noLogin {
    font-size: 14px;
    margin-right: 10%;
  }
  .goLogin {
    text-align: center;
    font-size: 14px;
    color: #223469;
  }
}
</style>
