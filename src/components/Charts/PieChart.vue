<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { getTheMapOfCate, getTheMapWithNameOfCate } from '@/api/table'

export default {
  mixins: [resize],
  props: {
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
    }
  },
  data() {
    return {
      chart: null,
      seriesData: []
    }
  },
  created() {
    this.getEquCate()
  },
  mounted() {
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getEquCate() {
      new Promise((resolve, reject) => {
        getTheMapWithNameOfCate()
          .then(resp => {
            const map = resp.data
            const length = Object.keys(map).length

            for (let i = 0; i < length; i++) {
              const str = map[i]
              // value -- 类被的数量
              // name -- 类别的名称
              this.seriesData.push({
                value: str.substring(str.lastIndexOf('-') + 1),
                name: str.substring(str.indexOf('-') + 1, str.lastIndexOf('-'))
              })
            }

            // 等回调函数执行完毕后，再执行echarts图的初始化工作。
            this.initChart()
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
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
        legend: {
          orient: 'vertical',
          top: '30%',
          left: '10%',
          textStyle: {
            color: '#100C2A'
          }
        },
        title: {
          text: '实践基地设备类别一览',
          x: '20',
          top: '20',
          textStyle: {
            color: '#100C2A',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '设备种类',
            type: 'pie',
            selectedMode: 'single',
            radius: [50, 280],
            center: ['60%', '50%'],
            roseType: 'area',
            label: {
              position: 'inner',
              fontSize: 14
            },
            itemStyle: {
              borderRadius: 8,
              borderColor: '#000000',
              borderWidth: 1.5
            },
            data: this.seriesData
          }
        ]
      })
    }
  }
}
</script>
