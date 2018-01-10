<template>
<div class='card' :class='[cardClass,isHide]'>{{(ch==' ')?'&nbsp;':ch}}</div>
</template>
<script>
export default {
  name: 'card',
  props: ['ch', 'isClear'],
  data() {
    return {
      cardClass: ''
    }
  },
  computed:{
    isHide(){return this.ch==' '?'hide':'show';}
  },
  watch: {
    isClear(val) {
      if (val) {
        setTimeout(_ => {
          if (Math.random() > 0.5)
            this.cardClass = 'fadeLeft';
          else
            this.cardClass = 'fadeRight';
        }, Math.random() * 1000);
      }
    }
  }
}
</script>

<style lang="less">
@cardHeight: 50px;
.fadeLeft {
    animation: fadeLeftAni 0.5s ease-in forwards !important;
}
.fadeRight {
    animation: fadeRightAni 0.5s ease-in forwards !important;
}
.card {
    &.hide {
        opacity: 0;
    }
    &.show{
      animation: cardAni 1.5s ease-out forwards;
    }
    font-family: 'psl';
    // background: url("../img/cardBg.jpg");
    color: white;
    background: #95313c;
    position: relative;
    margin: 2px;
    display: inline-block;
    text-transform: uppercase;
    font-size: 40px;
    width: 29px;
    border-radius: 4px;
    text-align: center;
    height: @cardHeight;
    line-height: @cardHeight;
    box-shadow: 2px 2px 2px black;
    transform-origin: 50% 15%;
    transform: perspective(100px) rotateY(60deg) rotateX(150deg);
    // backface-visibility: hidden;
}
@keyframes fadeLeftAni {
    0% {
        transform: perspective(800px);
    }
    100% {
        transform: perspective(800px) translate(40px,100px) rotateY(270deg);
        opacity: 0;
    }
}
@keyframes fadeRightAni {
    0% {
        transform: perspective(800px);
    }
    100% {
        transform: perspective(800px) translate(-40px,100px) rotateY(-270deg);
        opacity: 0;
    }
}
@keyframes cardAni {
    0% {
        opacity: 0;
        transform: perspective(100px) rotateY(60deg) rotateX(150deg);
    }
    30% {
        opacity: 1;
    }
    50% {
        opacity: 1;
        transform: perspective(800px) rotateZ(30deg);
    }
    70% {
        transform: perspective(800px) rotateZ(-20deg);
    }
    80% {
        transform: perspective(800px) rotateZ(10deg);
    }
    90% {
        transform: perspective(800px) rotateZ(-5deg);
    }
    100% {
        transform: perspective(800px);
    }
}
</style>
