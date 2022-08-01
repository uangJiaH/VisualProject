<template>
  <div class="com-container">
    <div ref="map_ref" class="com-chart"></div>
  </div>
</template>

<script>

import { getProvinceMapInfo } from '@/utils/map_utils'
import axios from 'axios'

export default {
  data () {
    return {
      chartInstance: null,
      allData: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    revertMap () {
      this.chartInstance.setOption({ geo: { map: 'china' } })
    },
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const res = await this.$http.get('./static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      this.getScatterData()

      const initOption = {
        title: {
          text: '▎ 商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        //arg.name 就是所点击的省份名称,是中文
        const provinceInfo = getProvinceMapInfo(arg.name)
        const { data: ret } = await axios.get('http://127.0.0.1:8999' + provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key, ret)
        this.chartInstance.setOption({
          geo: {
            map: provinceInfo.key
          }
        })
      })
      this.getScatterData()
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      this.updateChart()
    },
    async getScatterData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('./data/map.json')
      console.log(ret, 'resss')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 图例数据
      const legendData = this.allData.map((item) => {
        console.log(item, '123')
        return item.name
      })
      // 散点数据
      const seriesArr = this.allData.map((item) => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          coordinateSystem: 'geo',
          name: item.name,
          data: item.children
        }
      })
      // 处理图表需要的数据
      const dataOption = {
        legend: { data: legendData },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  computed: {},

}
</script>

<style lang="scss" scoped>

</style>
