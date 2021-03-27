<template>
  <div id="app">
    <!-- 路由占位符 -->
    <!--    <router-view />-->
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  mounted() {
  },
  methods: {
    // reload() {
    //   this.isRouterAlive = false
    //   this.$nextTick(() => this.isRouterAlive = true)
    // }

    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
