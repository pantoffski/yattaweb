<template>
<div id='raceViewer'>

  <br/><br/>
  <!-- <button @click='getRunner'>getRunner</button>
  <button @click='getGunTime'>getGunTime</button> -->
  <button @click='startRace'>startRace</button>
  <br/><br/>
  <button @click='resetData'>resetData</button>
  <br/><br/>
  bib<input type='text' v-model='bib'/>
  min<input type='text' v-model='min'/>
  sec<input type='text' v-model='sec'/>
  <button @click='warp'>แก้เวลา</button>
  <br/><br/>
  <br/>
</div>
</template>

<script>
export default {
  name: 'raceViewer',
  data() {
    return {bib:'',min:'',sec:''}
  },
  methods: {
    warp() {
      if (confirm('แก้เวลา ?')) {
      this.$http.post('/warp/'+this.bib+'/'+this.min+'/'+this.sec).then(resp => {
        console.log(resp.data);
      });
    }
    },
    resetData() {
      var p = prompt('reset');
      if (p == 'reset') {
        console.log('resetData');
        this.$http.post('/resetRace').then(resp => console.log(resp));
      }
    },
    startRace() {
      if (confirm('start ?')) {
        console.log('startRace');
        this.$http.post('/startRace', {
          gunTime: new Date().getTime()
        }).then(resp => console.log(resp));
      }
    }
  },
  mounted() {},
  computed: {},
  watch: {},
  components: {}
}
</script>

<style lang='less' >
#raceViewer {
    .logContainer {
        border: 1px solid black;
        height: 100px;
        overflow: auto;
    }
    h3 {
        position: relative;
        display: inline-block;
        &.connected:after {
            background-color: green;
        }
        &:after {
            content: '';
            background-color: red;
            display: block;
            position: absolute;
            top: 0;
            right: -40px;
            width: 20px;
            height: 20px;
            border-radius: 20px;
        }
    }
    td {
        padding: 5px;
        text-align: center;
    }
    thead td {
        padding: 0;
        cursor: pointer;
        background: lightblue;
        span {
            padding: 5px 40px;
            display: inline-block;
            position: relative;
            &.up:after {
                content: '';
                display: block;
                position: absolute;
                top: 7px;
                right: 10px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 12px solid #666;
            }
            &.down:after {
                content: '';
                display: block;
                position: absolute;
                top: 7px;
                right: 10px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid #666;
            }
            outline: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
    }
}
</style>
