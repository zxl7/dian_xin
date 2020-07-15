<template>
  <div>
    <van-popup :style="{ height: '30%',width:'70%' }" close-icon="close" closeable v-model="show">
      <p class="popup-title">未登录，是否登录 ？</p>
      <a class="popup-buttom" href="http://wsq.cdyoue.com/mobile/wsq/login">去登录</a>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: ['showPage'],

  data () {
    return {
      show: false
    }
  }
}
</script>

<style>
.popup-title {
  display: flex;
  font-size: 1rem;
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
