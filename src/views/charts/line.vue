<template>

  <div class="chart-container">
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/LineMarker'

export default {
  name: 'LineChart',
  components: { Chart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 184px);
}
</style>

