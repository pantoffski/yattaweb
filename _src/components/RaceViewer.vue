<template>
<div id='raceViewer'>
  <h3 :class="(isConnected?'connected':'')">cmd center</h3><br/> tags : {{sortedTags.length}}
  <br/><br/>
  <button @click='getRunner'>getRunner</button>
  <button @click='getStartTime'>getStartTime</button>
  <button @click='startRace'>startRace</button>
  <button @click='resetData'>resetData</button>
  <br/>
  <table border=1>
    <thead>
      <tr>
        <td><span :class='sortByTagIdClass()' @click='sortByTagId'>tagId</span></td>
        <td><span :class='sortBytStampClass()' @click='sortBytStamp'>chk1</span></td>
        <td><span :class='sortBytStampClass()' @click='sortBytStamp'>chk2</span></td>
        <td><span :class='sortBytStampClass()' @click='sortBytStamp'>chk3</span></td>
        <td><span :class='sortBytStampClass()' @click='sortBytStamp'>tStamp</span></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(aTag,index) in sortedTags" :key="index">
        <td>{{aTag.tagId}}</td>
        <td>{{aTag.chk1}}</td>
        <td>{{aTag.chk2}}</td>
        <td>{{aTag.chk3}}</td>
        <td>{{aTag.updatedAt}}</td>
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
  data() {
    return {
      lastUpdate: 0,
      isUpload: false,
      sortBy: 2,
      di: 1
    }
  },
  methods: {
    getRunner() {
      console.log('getRunner');
      this.$http.get('/apinaja/runners/' + this.lastUpdate).then(resp => {
        console.log(resp);
        if (resp.data.length > 0)
          this.lastUpdate = resp.data[0].updatedAt;
      });
    },
    resetData() {
      console.log('resetData');
      this.$http.post('/apinaja/resetRace').then(resp => console.log(resp));
    },
    startRace() {
      console.log('startRace');
      this.$http.post('/apinaja/startRace', {
        startTime: new Date().getTime()
      }).then(resp => console.log(resp));
    },
    getStartTime() {
      console.log('startRace');
      this.$http.post('/apinaja/getStartTime').then(resp => console.log(resp));
    },
    addTags() {
      console.log('addTags');
      this.$http.post('/apinaja/addTags', {
        stat: '3 tags remain',
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
    sortByMatId(state) {
      if (this.sortBy != 0) {
        this.sortBy = 0;
        this.di = 1;
      } else {
        this.di = this.di * -1;
      }
    },
    sortByTagId(state) {
      if (this.sortBy != 1) {
        this.sortBy = 1;
        this.di = 1;
      } else {
        this.di = this.di * -1;
      }
    },
    sortBytStamp(state) {
      if (this.sortBy != 2) {
        this.sortBy = 2;
        this.di = 1;
      } else {
        this.di = this.di * -1;
      }
    }
  },
  mounted() {},
  computed: {
    sortedTags() {
      return this.tags;
      var idx = this.sortBy;
      return this.tags.sort(function(a, b) {
        if (a[idx] === b[idx]) return 0;
        return (a[idx] < b[idx]) ? 1 * this.di : -1 * this.di;
      });
    },
    ...mapState({
      isConnected: state => state.isConnected,
      tags: state => state.tags
    })
  },
  watch: {},
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
