<template>
  <div class="com-container">
    <!--    Seller组件-->
    <div ref="seller_ref" class="com-chart"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,    //echarts实例对象
      allData: [],      //服务器获取所有的数据
      currentPage: 1,      //当前页数
      totalPage: 0,      //总页数需要进行计算，每页显示5个条目
      timerId: null     //定时器标识
    }
  },
  mounted () {
    // 由于初始化echarts实例对象需要使用到dom元素,因此必须要放到mounted中, 而不是created
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed () {
    clearInterval(this.timerId)
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 当浏览器的大小发生变化的时候, 会调用的方法, 来完成屏幕的适配
    screenAdapter () {
      // console.log(this.$refs.seller_ref.offsetWidth, 'width')
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize

            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      //手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    },
    initChart () {
      console.log(this.$refs.seller_ref)
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')   //初始化echarts实例对象
      // 对图表初始化配置的控制
      const initOption = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        title: {
          text: '▎ 商家销量排行',
          left: 20,
          top: 20,
          textStyle: { textStyle: { 'color': '#fff' } }
        },
        // 坐标轴的大小
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        // 工具提示和背景
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 指明颜色渐变的方向
              barBorderRadius: [0, 33, 33, 0],
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态之下的颜色值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分之100状态之下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
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
      const { data: res } = await this.$http.get('./data/seller.json')
      this.allData = res
      console.log(res, 'res ')
      // 对allData进行从大到小的排序
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      //计算总页数
      this.totalPage = this.allData.length % 5 === 0 ? parseInt(this.allData.length / 5) : parseInt
      (this.allData.length / 5) + 1
      this.updateChart()
      this.startInterval()     //开启动画效果
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      // 处理数据并且更新界面图表
      const sellerNames = showData.map((item) => {
        return item.name
      })

      const sellerValues = showData.map((item) => {
        return item.value
      })

      const dataOption = {
        xAxis: {
          type: 'value',
          max: this.allData[this.allData.length - 1].value
        },
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
