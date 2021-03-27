<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem'

export default {
  components: { SidebarItem },
  mixins: [resize],
  props: {
    obj: Object,
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      value: 0.35
    }
  },
  watch: {
    chartData(val) {
      this.setOptions(val)
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + 'month')
        }
        return data
      }())
      this.chart.setOption({
        // backgroundColor: '#100C2A',
        title: {
          text: '设备绩效统计',
          x: '20',
          top: '20',
          textStyle: {
            color: '#000000',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        series: [{
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function(value) {
              if (value === 0.875) {
                return '优'
              } else if (value === 0.625) {
                return '中'
              } else if (value === 0.375) {
                return '良'
              } else if (value === 0.125) {
                return '差'
              }
            }
          },
          title: {
            offsetCenter: [0, '-30%'],
            fontSize: 30
          },
          detail: {
            fontSize: 50,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function(value) {
              return Math.round(value * 100) + '分'
            },
            color: 'auto'
          },
          data: [{
            value: this.value,
            name: '绩效得分'
          }]
        }]
      })
    },
    getValue() {
      // let jsonStr = []
      // jsonStr.push(0.34)
      return 0.52
    }
  }
}
</script>
