<template>
<div id='raceViewer'>
  <h3 :class="(isConnected?'connected':'')">raceName : {{raceName}}</h3><br/> tags : {{tags.length}}
  <br/><br/>
  <button @click='addTags'>addTags</button>
  <button @click='resetData'>resetData</button>
  <br/>
  <table border=1>
    <thead>
      <tr>
        <td><span :class='sortByMatIdClass()' @click='sortByMatId'>matId</span></td>
        <td><span :class='sortByTagIdClass()' @click='sortByTagId'>tagId</span></td>
        <td><span :class='sortBytStampClass()' @click='sortBytStamp'>tStamp</span></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(aTag,index) in sortedTags" :key="index">
        <td>{{aTag[0]}}</td>
        <td>{{aTag[1]}}</td>
        <td>{{aTag[2]}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex';
export default {
  name: 'raceViewer',
  props: ['raceName'],
  data() {
    return {
      isUpload: false,
    }
  },
  methods: {
    resetData() {
      console.log('resetData');
      this.$http.post('/apinaja/resetRace').then(resp => console.log(resp));
    },
    addTags() {
      console.log('addTags');
      this.$http.post('/apinaja/addTags', {
        stat:'3 tags remain',
          tags: [
            [1, 1, 666],
            [1, 2, 1666],
            [2, 4, 2666],
            [1, 4, 3666],
            [2, 5, 4666],
            [2, 6, 4666]
          ],
        foo: 'bar'
      }).then(({
      data,
      status
    }) => console.log(data, status));
  },
  ...mapActions(['initData', 'bar']),
  sortByTagIdClass() {
    if (this.sortBy == 1) {
      return (this.sortDi == 1) ? 'up' : 'down';
    }
  },
  sortByMatIdClass() {
    if (this.sortBy == 0) {
      return (this.sortDi == 1) ? 'up' : 'down';
    }
  },
  sortBytStampClass() {
    if (this.sortBy == 2) {
      return (this.sortDi == 1) ? 'up' : 'down';
    }
  },
  sortByMatId() {
    this.$store.commit('sortByMatId');
  },
  sortByTagId() {
    this.$store.commit('sortByTagId');
  },
  sortBytStamp() {
    this.$store.commit('sortBytStamp');
  }
},
mounted() {
    //console.log('mounted, raceName: ' + this.raceName);
    this.$socket.emit('joinRace', this.raceName);
  },
  computed: {
    ...mapState({
      isConnected: state => state.isConnected,
      tags: state => state.tags,
      sortBy: state => state.sortBy,
      sortDi: state => state.di,
      needInitRaceName: state => state.needInitRaceName
    }),
    ...mapGetters(['sortedTags'])
  },
  watch: {
    'needInitRaceName' () {
      //console.log('need to init race name !!! ' + this.needInitRaceName);
      if (this.needInitRaceName)
        this.$socket.emit('joinRace', this.raceName);
      this.$store.commit('doneInitRaceName');
    }
  },
  components: {}
}
</script>

<style lang='less' >
#raceViewer {
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
