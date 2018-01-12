<template>
<div class='boardHead'>
  <div :class="['mainCat',this.isClear?'hide':'']">{{mainCat}}</div>
  <div :class="['subCat',this.isClear?'hide':'']">{{subCat}}</div>
  <div :class="['gender',mainCat,this.isClear?'hide':'']"></div>
</div>
</template>
<script>
export default {
  name: 'boardHead',
  props: ['raceCat', 'isClear'],
  data() {
    return {}
  },
  computed: {
    mainCat() {
      if (this.raceCat == 'overall') return 'over';
      if (this.raceCat.slice(-1) == 'm') return 'male';
      return 'female';
    },
    subCat() {
      if (this.raceCat == 'overall') return 'all';
      var cat = this.raceCat.slice(0, 2);
      var sex = this.raceCat.slice(-1);
      if (!isNaN(cat * 1)) {
        cat *= 1;
        if (cat == 0) return '< 25';
        if (cat == 60 && sex == 'm') return '> 60';
        if (cat == 50 && sex == 'f') return '> 50';
        return cat + ' - ' + (cat + 4);
      }
      return cat;
    }
  }
}
</script>
<style lang="less">
.boardHead {
    @shadowSize: 1px;
    .gender {
        position: absolute;
        top: 25px;
        left: 215px;
        width: 145px;
        height: 145px;
        transition-duration: 0.5s;
        transition-delay: 0.0s;
        &:after {
            content: '';
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            width: 145px;
            height: 145px;
        }
        &.male:after {
            background: url("../img/m.png");
        }
        &.female:after {
            background: url("../img/f.png");
        }
        &.over:after {
            background: url("../img/a.png");
        }
        &.hide {
            transition-duration: 0.5s;
            transition-delay: 0.5s;
            transform: rotateY(90deg);
        }
    }
    .mainCat {
        right: 350px;
        width: 170px;
    }
    .subCat {
        left: 368px;
        width: 160px;
    }
    .mainCat,
    .subCat {
        text-align: center;
        position: absolute;
        top: 50px;
        font-size: 55px;
        font-family: 'pslBold';
        text-transform: uppercase;
        letter-spacing: 1.5px;
        text-shadow: 0 @shadowSize white,0px -@shadowSize white,@shadowSize 0 white,-@shadowSize 0 white,-@shadowSize -@shadowSize white,@shadowSize @shadowSize white,-@shadowSize @shadowSize white,@shadowSize -@shadowSize white;
        transition-duration: 0.5s;
        transition-delay: 0.0s;
        &.hide {
            transition-duration: 0.5s;
            transition-delay: 0.5s;
            transform: rotateX(90deg);
        }

    }
    position: absolute;
    left: 291px;
    top: 0;
    width: 554px;
    height: 199px;
    background: url("../img/headBg.png");
}
</style>
