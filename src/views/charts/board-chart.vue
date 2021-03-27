<template>
  <div>
    <div class="chart-container">
      <chart height="100%" width="100%" />
    </div>
    <div>
      <el-button type="primary" @click="hello()">主要按钮</el-button>
    </div>
  </div>
</template>

<script>
import chart from '@/components/Charts/BoardChart'

export default {
  name: 'BoardChart',
  components: { chart },
  data() {
    return {
      flag: false,
      value: '0.99'
    }
  },
  methods: {
    hello() {
      // this.$refs.myChart.method()
      alert(chart.data().value)
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 130px);
}
</style>

