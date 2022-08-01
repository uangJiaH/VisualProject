<template>
  <!--  热销商品图例-->
  <div class='com-container'>
    <div ref='hot_ref' class='com-chart'></div>
    <span :style="comStyle" class="iconfont arr_left" @click="toLeft">&#xe6ef;</span>
    <span :style="comStyle" class="iconfont arr_right" @click="toRight">&#xe6ed;</span>
    <span :style="comStyle" class="cat_name">{{ catTitle }}</span>
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
      currentIndex: 0,
      titleFontSize: 0
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
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    },

    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      const initOption = {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            let tipArray = []
            params.data.children.forEach(function (item) {
              let childStr = ` ${item.name}&nbsp;&nbsp;&nbsp; ${parseInt((item.value / params.value) * 100) + '%'} `
              tipArray.push(childStr)
            })
            return tipArray.join('<br/>')
          }
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        title: {
          text: '▎ 热销商品销售金额占比统计',
          left: 20,
          top: 20
        },
        series: [
          {
            type: 'pie',
            label: { // 隐藏文字
              show: false
            },
            labelLine: { // 隐藏线
              show: false
            },
            emphasis: {
              label: { // 高亮显示文字
                show: true
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('/data/hotproduct.json')
      console.log(ret, 'ret')
      this.allData = ret
      this.updateChart()
    }
    ,
    updateChart () {
      // 处理图表需要的数据
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children // 新增加children的原因是为了在tooltip中的formatter的回调函数中,来拿到这个二级分类下的三级分类数据
        }
      })
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)

    }
    ,

    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: { fontSize: this.titleFontSize / 2 }
        },
        title: { textStyle: { fontSize: this.titleFontSize } },
        series: [{
          radius: this.titleFontSize * 4.5,
          center: ['50%', '60%'],
        }]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  computed: {
    catTitle () {
      if (!this.allData) {
        return ''
      }
      return this.allData[this.currentIndex].name
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  }
}
</script>

<style lang="less" scoped>
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.arr_right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}

.cat_name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  font-weight: bold;
  color: white;
}
</style>
