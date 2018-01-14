<template>
<div id='scoreBoard' :style='boardStyle'>
  <em :class="['rank',(this.isClear||this.raceCat=='overall')?'hide':'']"><hr/></em>
  <em :class="['rank',(this.isClear||this.raceCat=='overall')?'hide':'']"><hr/></em>
  <em :class="['rank',(this.isClear||this.raceCat=='overall')?'hide':'']"><hr/></em>
  <cardContainer :startDelay='0' :top='192' :txt='winners[0]' :delay='delay' :isClear='isClear' :left='145' />
  <cardContainer :startDelay='500' :top='258' :txt='winners[1]' :delay='delay' :isClear='isClear' :left='145' />
  <cardContainer :startDelay='1000' :top='324' :txt='winners[2]' :delay='delay' :isClear='isClear' :left='145' />
  <cardContainer :startDelay='1500' :top='390' :txt='winners[3]' :delay='delay' :isClear='isClear' :left='145' />
  <cardContainer :startDelay='2000' :top='456' :txt='winners[4]' :delay='delay' :isClear='isClear' :left='145' />
  <b v-for='(blub,index) in blubs' key='index' :class='["blub",blub]'></b>
  <boardHead :raceCat='raceCat' :isClear='isClear' />
  <div class='preload'>haha
    <img src='../img/f.png' />
    <img src='../img/m.png' />
  </div>
</div>
</template>
<script>
import boardHead from '@/components/BoardHead'
import cardContainer from '@/components/CardContainer'
export default {
  name: 'scoreBoard',
  data() {
    return {
      dispTime: 10,
      blubs: this.genBlubs(),
      blubTimer: null,
      isClear: true,
      delay: 150,
      raceCat: 'overall',
      screenWidth: 100,
      screenHeight: 100,
      winners: ['', '', '', '', ''],
      raw: null
    }
  },
  methods: {
    dispWinner() {
      for (var i in this.raw) {
        this.isClear = false;
        this.raceCat = i;
        this.winners = ['', '', '', '', ''];
        this.$nextTick(function() {
          this.winners = this.raw[i].slice(0, 5);
          delete this.raw[i];
        });
        break;
      }
      if (Object.keys(this.raw).length == 1) {
        this.$http.post('/raceResult').then(resp => {
          this.raw = resp.data;
        });
      }
      setTimeout(() => this.clear(), this.dispTime * 1000);
    },
    getScreenSize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    },
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
      this.blubs = [...aBlub, ...ret];
    },
    clear() {
      this.isClear = true;
      setTimeout(() => this.dispWinner(), 3 * 1000);
    },
    setText() {
      this.isClear = false;
      this.t1 = '';
      this.t2 = '';
      this.str1 = '';
      this.str2 = '';
      this.$nextTick(function() {
        this.t1 = '55:59';
        this.t2 = '';
        this.str1 = this.inp1;
        this.str2 = this.inp1;
      });
    }
  },
  computed: {
    boardStyle() {
      var ret = {};
      var bw = 1155,
        bh = 576,
        r, l, t;
      r = Math.min(this.screenWidth / bw, this.screenHeight / bh);
      l = (this.screenWidth - bw * r) / 2;
      t = (this.screenHeight - bh * r) / 2;
      return {
        transform: 'scale(' + r + ')',
        left: l + 'px',
        top: t + 'px'
      }
    }
  },
  created() {
    this.blubTimer = setInterval(() => {
      this.shiftBlubs();
    }, 600);
    this.$http.post('/raceResult').then(resp => {
      this.raw = resp.data;
      this.dispWinner();
    });
  },
  beforeDestroy() {
    clearInterval(this.blubTimer);
  },
  mounted() {
    window.addEventListener('resize', this.getScreenSize);
    this.$nextTick(function() {
      this.getScreenSize();
    });
  },
  components: {
    cardContainer,
    boardHead
  }
}
</script>

<style lang="less">
@font-face {
    font-family: 'psl';
    src: url("../css/psl.ttf");
}
@font-face {
    font-family: 'pslBold';
    src: url("../css/pslBold.ttf");
}
body {
    background: black;
    background: url("../img/bodyBg.png");
    background-size: cover;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    counter-reset: rankCounter;
    overflow: hidden;
}
#guide,
#scoreBoard {
    position: absolute;
    transform-origin: 0 0;
    width: 1155px;
    height: 576px;
    background: url("../img/boardBg.png");
    .preload {
        width: 1px;
        height: 1px;
        overflow: hidden;
        display: block;
        font-family: 'psl';
        &:after {
            content: 'haha';
            font-family: 'pslBold';
        }
    }
}
#guide {
    // background: url("../img/guide.png");
    opacity: 0.3;
    display: none;
}
/* rank badges */
.rank {
    @badgeSize: 48px;
    position: absolute;
    left: 80px;
    transition-duration: 0.5s;
    counter-increment: rankCounter;
    &.hide {
        transform: translateY(100px);
        opacity: 0;
        &:nth-of-type(1) {
            transition-delay: 0.4s;
        }
        &:nth-of-type(2) {
            transition-delay: 0.2s;
        }
        &:nth-of-type(3) {
            transition-delay: 0.0s;
        }
    }
    &:after {
        content: counter(rankCounter);
        position: absolute;
        width: @badgeSize;
        height: @badgeSize;
        line-height: @badgeSize;
        text-align: center;
        color: white;
        font-size: 40px;
        font-family: 'psl';
        font-style: normal;
    }
    &:nth-of-type(1) {
        top: 195px;
        transition-delay: 0.0s;
        hr {
            background: url("../img/icon.png");
        }
    }
    &:nth-of-type(2) {
        top: 260px;
        transition-delay: 0.2s;
        hr {
            background: url("../img/icon2.png");
        }
    }
    &:nth-of-type(3) {
        top: 327px;
        transition-delay: 0.4s;
        hr {
            background: url("../img/icon3.png");
        }
    }
    hr {
        position: absolute;
        width: @badgeSize;
        height: @badgeSize;
        border: 0 none;
        margin: 0;
        animation: rankAni 10s linear infinite;
    }

}
@keyframes rankAni {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }

}
/* blubs */
@blubSize: 9px;
@glowRadius: 2px;
.blub {
    position: absolute;
    background: #FF9900;
    border-radius: 999px;
    display: inline-block;
    width: @blubSize;
    height: @blubSize;
    transition-duration: 5s;
    &.on {
        transition-duration: 0.6s;
        background: #fff;
        box-shadow: 0 0 @glowRadius #fff, 0 0 @glowRadius*2 #fff, 0 0 @glowRadius*3 #fff, 0 0 @glowRadius*4 #FF9900, 0 0 @glowRadius*7 #FF9900, 0 0 @glowRadius*8 #FF9900, 0 0 @glowRadius*10 #FF9900, 0 0 @glowRadius*15 #FF9900;
    }
}
.blubTop (@i) when (@i<32) {
    @idx: @i+1;
    .blub:nth-of-type(@{idx}) {
        top: 142px;
        left: 96px + @i * 30.5px;
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
        left: 1094px;
        top: 178px + @i * 32px;
    }
    .blubRight(@i+1);
}
.blubRight(0);
.blub:nth-of-type(45) {
    top: 533px;
    left: 1081px;
}
.blubBottom (@i) when (@i<32) {
    @idx: @i+46;
    .blub:nth-of-type(@{idx}) {
        top: 541px;
        left: 1045px - @i * 30.5px;
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
        left: 53px;
        top: 500px - @i * 32px;
    }
    .blubLeft(@i+1);
}
.blubLeft(0);
.blub:nth-of-type(90) {
    top: 153px;
    left: 62px;
}
</style>
