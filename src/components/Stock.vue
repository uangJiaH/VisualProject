<template>
  <!--库存销量分析-->
  <div class='com-container'>
    <div ref='stock_ref' class='com-chart'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      timerId: null,
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
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, 'chalk')
      const centerPointers = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const initOption = {
        title: {
          text: '▎ 库存销售量',
          left: 20,
          top: 20
        },
        series: [
          {
            type: 'pie',
            center: centerPointers[0],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[1],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[2],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[3],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          },
          {
            type: 'pie',
            center: centerPointers[4],
            hoverAnimation: false,
            label: {
              show: true,
              position: 'center'
            },
            labelLine: { show: false }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('/data/stock.json')
      this.allData = ret
      this.updateChart()
      this.startInterval()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart()
      }, 3000)
    },
    updateChart () {

      // 处理图表需要的数据
      // 5个圆环对应的圆心点
      const centerPointers = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      // 增加5个圆环的渐变颜色范围
      const colorArrs = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]

      // 先显示前5条数据
      // 处理图表需要的数据
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)

      const seriesArr = showData.map((item, index) => {
        return {
          label: {
            position: 'center',
            color: colorArrs[index][0]
          },
          labelLine: { show: false },// 隐藏指示线
          hoverAnimation: false, // 关闭鼠标移入到饼图时的动画效果
          type: 'pie',
          center: centerPointers[index],
          radius: [110, 100],
          data: [
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArrs[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArrs[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: { color: '#333843' }
            }
          ]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
      const innerRadius = titleFontSize * 2.8
      const outterRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: { fontSize: this.titleFontSize }
        },
        series: [
          {
            radius: [outterRadius, innerRadius],
            label: { fontSize: this.titleFontSize / 2 }
          },
          {
            radius: [outterRadius, innerRadius],
            label: { fontSize: this.titleFontSize / 2 }
          },
          {
            radius: [outterRadius, innerRadius],
            label: { fontSize: this.titleFontSize / 2 }
          },
          {
            radius: [outterRadius, innerRadius],
            label: { fontSize: this.titleFontSize / 2 }
          },
          {
            radius: [outterRadius, innerRadius],
            label: { fontSize: this.titleFontSize / 2 }
          }

        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
}
</script>

<style lang="less" scoped>

</style>
