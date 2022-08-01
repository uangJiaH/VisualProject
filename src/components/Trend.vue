<template>
  <div class='com-container'>
    <div :style="comStyle" class="title">
      <span>{{ '▎ ' + title }}</span>
      <span :style="comStyle" class="iconfont title-icon" @click="showChoice=!showChoice">&#xe6eb;</span>
      <div v-if="showChoice" :style="marginStyle" class="select-con">
        <div v-for="item in selectTypes" :key="item.key" class="select-item" @click="handleSelect(item.key)">
          {{ item.text }}
        </div>

      </div>
    </div>
    <div ref="trend_ref" class="com-chart"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'

export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      dataType: 'map',
      showChoice: false,  //控制可选面板的显示和隐藏
      titleFontSize: 0
    }
  },
  computed: {
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px',
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    selectTypes () {
      if (!this.allData || !this.allData.type) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.dataType
        })
      }
    },
    title () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.dataType].title
      }
    },
    ...mapState(['theme'])
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
    handleSelect (key) {
      console.log(key)
      this.dataType = key
      this.updateChart()
      this.showChoice = false
    },
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: { trigger: 'axis' },
        legend: {
          top: '15%',
          icon: 'circle',
          left: 20
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('./data/trend.json')
      this.allData = ret
      console.log(ret)
      this.updateChart()
    },
    updateChart () {
      // 半透明颜色
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明颜色
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]

      // X轴的数据
      const timeArrs = this.allData.common.month
      // y轴的数据, 暂时先取出map这个节点的数据
      // map代表地区销量趋势
      // seller代表商家销量趋势
      // commodity代表商品销量趋势
      const valueArrs = this.allData[this.dataType].data
      // 图表数据，一个图表中显示5条数据
      const seriesArr = valueArrs.map((item, index) => {
        return {
          type: 'line',
          name: item.name,
          data: item.data,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: colorArr1[index]
            }, {
              offset: 1,
              color: colorArr2[index]
            }])
          },

          stack: this.dataType    // stack值相同, 可以形成堆叠图效果
        }

      })
      // 准备图例数据, 它需要和series下的每个对象的name属性保持一致
      const legendArr = valueArrs.map(item => {
        return item.name
      })
      // 处理图表需要的数据
      const dataOption = {
        xAxis: {
          data: timeArrs
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }

        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },

}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-item {
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
  }

  .select-item {
    cursor: pointer;
  }
}
</style>
