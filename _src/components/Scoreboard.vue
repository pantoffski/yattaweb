<template>
<div id='scoreBoard'>
  <input type='text' v-model='inp1' />
  <Br/>
  <br/>
  <br/>
  <button @click='setText'>setText</button>
  <button @click='clear'>clear</button>
  <br/>
  <cardContainer :startDelay='0' :top='100' :txt='str1' :delay='delay' :isClear='isClear' :left='100'/>
  <cardContainer :startDelay='500' :top='200' :txt='str2' :delay='delay' :isClear='isClear' :left='100'/>
  <cardContainer :startDelay='1000' :top='300' :txt='str1' :delay='delay' :isClear='isClear' :left='100'/>
  <cardContainer :startDelay='1500' :top='400' :txt='str2' :delay='delay' :isClear='isClear' :left='100'/>
</div>
</template>
<script>
import cardContainer from '@/components/CardContainer'
export default {
  name: 'scoreBoard',
  data() {
    return {
      isClear:false,
      delay: 150,
      inp1: '',
      str1: '',
      str2: ''
    }
  },
  methods: {
    clear(){
      this.isClear=true;
    },
    setText() {
      this.isClear=false;
      this.str1 = this.inp1;
      this.str2 = this.inp1.split('').reverse().join('');
    }
  },
  components: {
    cardContainer
  }
}
</script>

<style lang="less">
#scoreBoard {
    width: 100vw;
    height: 100vh;
    background: url("../img/bg.jpg");
}
body {
    margin: 0;
    padding: 0;
}
</style>
