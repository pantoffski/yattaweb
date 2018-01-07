<template>
<div class="cardContainer" :style="{left:left+'px',top:top+'px'}">
  <card v-if='index<=dispIdx' :key='index' :char='char' :isClear='isClear' v-for='(char,index) in cards' />
</div>
</template>
<script>
import card from '@/components/Card'
export default {
  name: 'cardContainer',
  props: ['left', 'top', 'txt', 'delay', 'startDelay','isClear'],
  data() {
    return {
      cards: [],
      dispIdx: -1,
    }
  },
  watch: {
    txt(val) {
      this.dispIdx = -1;
      this.cards = this.splitString(val);
      setTimeout(_ => {
        this.aniLoop();
      }, this.startDelay);
    }
  },
  methods: {
    aniLoop() {
      if (this.dispIdx < this.cards.length) {
        this.dispIdx++;
        setTimeout(_ => {
          this.aniLoop();
        }, this.delay);
      }
    },
    splitString(str) {
      var ret = [],
        tmp, currWidth;
      if (!str || str == '') return ret;
      var ctx = document.createElement('canvas').getContext('2d');
      ctx.font = 'monospace 10px;';
      var c = str.split('');
      tmp = c.splice(0, 1)+'';
      currWidth = ctx.measureText(tmp).width;
      while (c.length > 0) {
        var newWidth = ctx.measureText(tmp + c[0]).width;
        if ((newWidth / currWidth) > 1.2) {
          ret.push(tmp);
          tmp = c.splice(0, 1) + '';
        } else {
          tmp += c.splice(0, 1);
        }
        currWidth = ctx.measureText(tmp).width;
      }
      ret.push(tmp);
      return ret;
    }
  },
  components: {
    card
  }
}
</script>
<style lang="less">
.cardContainer {
    position: absolute;
}
</style>
