<template>
<div id='scoreBoard'>
  <div v-for='(blub,index) in blubs' key='index' :class='["blub",blub]'></div>
  <input type='text' v-model='inp1' />
  <Br/>
  <br/>
  <br/>
  <button @click='setText'>setText</button>
  <button @click='clear'>clear</button>
  <br/>
  <cardContainer :startDelay='0' :top='100' :txt='str1' :delay='delay' :isClear='isClear' :left='100' />
  <cardContainer :startDelay='500' :top='200' :txt='str2' :delay='delay' :isClear='isClear' :left='100' />
  <cardContainer :startDelay='1000' :top='300' :txt='str1' :delay='delay' :isClear='isClear' :left='100' />
  <cardContainer :startDelay='1500' :top='400' :txt='str2' :delay='delay' :isClear='isClear' :left='100' />
</div>
</template>
<script>
import cardContainer from '@/components/CardContainer'
export default {
  name: 'scoreBoard',
  data() {
    return {
      blubs: this.genBlubs(),
      blubTimer: null,
      isClear: false,
      delay: 150,
      inp1: '',
      str1: '',
      str2: ''
    }
  },
  methods: {
    genBlubs() {
      var row = ['on', '', '', '', '', '', '', '', ''],
        ret = [];
      while (ret.length < 90)
        ret = [...ret, ...row];
      return ret;
    },
    shiftBlubs() {
      var ret = this.blubs;
      var aBlub = ret.splice(-1);
      this.blubs=[...aBlub,...ret];
    },
    clear() {
      this.isClear = true;
    },
    setText() {
      this.isClear = false;
      this.str1 = this.inp1;
      this.str2 = this.inp1.split('').reverse().join('');
    }
  },
  created() {
    this.blubTimer = setInterval(() => {
      this.shiftBlubs();
    }, 600);
  },
  beforeDestroy() {
    clearInterval(this.blubTimer);
  },
  components: {
    cardContainer
  }
}
</script>

<style lang="less">
@blubSize: 15px;
@glowRadius: 2px;
#scoreBoard {
    position: absolute;
    transform-origin: 0 0;
    width: 1155px;
    height: 576px;
    background: url("../img/scoreBoardBg.jpg");
}
body {
    background: black;
    margin: 0;
    padding: 0;
}
.blub {
    position: absolute;
    background: #FF9900;
    border-radius: 999px;
    display: inline-block;
    width: @blubSize;
    height: @blubSize;
    transition-duration: 3s;
    &.on {
        transition-duration: 1s;
        background: #fff;
        box-shadow: 0 0 @glowRadius #fff, 0 0 @glowRadius*2 #fff, 0 0 @glowRadius*3 #fff, 0 0 @glowRadius*4 #FF9900, 0 0 @glowRadius*7 #FF9900, 0 0 @glowRadius*8 #FF9900, 0 0 @glowRadius*10 #FF9900, 0 0 @glowRadius*15 #FF9900;
    }
}
.blubTop (@i) when (@i<32) {
    @idx: @i+1;
    .blub:nth-of-type(@{idx}) {
        top: 139px;
        left: 94px + @i * 30.5px;
    }
    .blubTop(@i+1);
}
.blubTop(0);
.blub:nth-of-type(33) {
    top: 147px;
    left: 1078px;
}
.blubRight (@i) when (@i<11) {
    @idx: @i+34;
    .blub:nth-of-type(@{idx}) {
        left: 1091px;
        top: 178px + @i * 32px;
    }
    .blubRight(@i+1);
}
.blubRight(0);
.blub:nth-of-type(45) {
    top: 531px;
    left: 1078px;
}
.blubBottom (@i) when (@i<32) {
    @idx: @i+46;
    .blub:nth-of-type(@{idx}) {
        top: 538px;
        left: 1042px - @i * 30.5px;
    }
    .blubBottom(@i+1);
}
.blubBottom(0);
.blub:nth-of-type(78) {
    top: 531px;
    left: 62px;
}
.blubLeft (@i) when (@i<11) {
    @idx: @i+79;
    .blub:nth-of-type(@{idx}) {
        left: 50px;
        top: 500px - @i * 32px;
    }
    .blubLeft(@i+1);
}
.blubLeft(0);
.blub:nth-of-type(90) {
    top: 147px;
    left: 62px;
}
</style>
