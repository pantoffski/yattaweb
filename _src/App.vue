<template>
  <div>
    <router-view></router-view>
  </div>
  </template>
<script>
import {
  mapState
} from 'vuex';
export default {
  name: 'app',
  data() {
    return {}
  },
  methods: {

  },
  computed: {
    foo() {
      return 'bar'
    }
  }
}
</script>
