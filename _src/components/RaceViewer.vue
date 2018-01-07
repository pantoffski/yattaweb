<template>
<div id='raceViewer'>
  <h3 :class="(isConnected?'connected':'')">cmd center</h3><br/> tags : {{sortedTags.length}}
  <br/><br/>
  <div class='logContainer'>
    <div v-for="m in message">{{m}}</div>
  </div>
  <br/><br/>
  <!-- <button @click='getRunner'>getRunner</button>
  <button @click='getGunTime'>getGunTime</button> -->
  <button @click='startRace'>startRace</button>
  <button @click='resetData'>resetData</button>
  <button @click='addTagColumn'>addTagColumn</button>
  <br/>
  <table border=1>
    <thead>
      <tr>
        <td><span :class='columnClass.tagId' @click='setSortBy("tagId")'>tagId</span></td>
        <td><span :class='columnClass.chk1' @click='setSortBy("chk1")'>chk1</span></td>
        <td><span :class='columnClass.chk2' @click='setSortBy("chk2")'>chk2</span></td>
        <td><span :class='columnClass.chk3' @click='setSortBy("chk3")'>chk3</span></td>
        <td><span :class='columnClass.updatedAt' @click='setSortBy("updatedAt")'>updatedAt</span></td>
        <td><span :class='columnClass.isDq' @click='setSortBy("isDq")'>isDq</span></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(aTag,index) in sortedTags" :key="index">
        <td>{{aTag.tagId}}</td>
        <td>{{aTag.chk1}}</td>
        <td>{{aTag.chk2}}</td>
        <td>{{aTag.chk3}}</td>
        <td>{{aTag.updatedAt}}</td>
        <td>{{aTag.isDq}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex';
export default {
  name: 'raceViewer',
  data() {
    return {
      lastUpdate: 0,
      isUpload: false,
      sortBy: 'updatedAt',
      di: 1,
      columnClass: {
        tagId: '',
        chk1: '',
        chk2: '',
        chk3: '',
        updatedAt: 'down',
        isDq: ''
      }
    }
  },
  methods: {
    getRunner() {
      console.log('getRunner');
      this.$http.post('/apinaja/runners/' + this.lastUpdate).then(resp => {
        console.log(resp);
        if (resp.data.length > 0)
          this.lastUpdate = resp.data[0].updatedAt;
      });
    },
    addTagColumn() {
      console.log('addTagColumn');
      this.$http.post('/apinaja/addTagColumn').then(resp => console.log(resp));
    },
    resetData() {
      console.log('resetData');
      this.$http.post('/apinaja/resetRace').then(resp => console.log(resp));
      this.clearTag();
    },
    startRace() {
      console.log('startRace');
      this.$http.post('/apinaja/startRace', {
        gunTime: new Date().getTime()
      }).then(resp => console.log(resp));
    },
    getGunTime() {
      console.log('startRace');
      this.$http.post('/apinaja/getGunTime').then(resp => console.log(resp));
    },
    setSortBy(columnName) {
      for (var i in this.columnClass) {
        this.columnClass[i] = '';
      }
      if (this.sortBy != columnName) {
        this.sortBy = columnName;
        this.di = 1;
      } else {
        this.di = this.di * -1;
      }
      this.columnClass[this.sortBy] = (this.di == 1) ? 'down' : 'up';
    },
    ...mapMutations(['clearTag'])
  },
  mounted() {},
  computed: {
    sortedTags() {
      var idx = this.sortBy;
      var di = this.di;
      return this.tags.sort(function(a, b) {
        if (a[idx] === b[idx]) return 0;
        return (a[idx] * 1 < b[idx] * 1) ? 1 * di : -1 * di;
      });
    },
    ...mapState({
      isConnected: state => state.isConnected,
      tags: state => state.tags,
      message: state => state.message
    })
  },
  watch: {},
  components: {}
}
</script>

<style lang='less' >
#raceViewer {
  .logContainer{
    border: 1px solid black;
    height:100px;
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
