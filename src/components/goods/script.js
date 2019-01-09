export default {
  data () {
    return {
      // 商品类表数据
      goodsList: [],
      // 当前页
      pagenum: 1,
      // 每页大小
      pagesize: 5,
      // 总条数
      total: 0
    }
  },

  created () {
    // 进入页面，获取路由参数中的当前页
    // console.log('当前页：', typeof this.$route.params.page)
    const pagenum = this.$route.params.page - 0
    // 方法根据传入的页码，来获取指定页的数据
    this.getGoodsList(pagenum)
  },

  watch: {
    // 监听路由的改变，只要路由发生改变，就执行这段代码逻辑
    // 方法中通过 to 获取到当前路由中的 页码
    // 然后，根据当前页来获取数据
    $route (to, from) {
      const pagenum = to.params.page - 0
      // 方法根据传入的页码，来获取指定页的数据
      this.getGoodsList(pagenum)
    }
  },

  methods: {
    // 分页获取商品列表数据
    async getGoodsList (pagenum = 1) {
      const res = await this.$http.get('/goods', {
        params: {
          query: '',
          pagenum,
          pagesize: this.pagesize
        }
      })

      const { goods, pagenum: curPage, total } = res.data.data

      this.goodsList = goods
      this.pagenum = curPage - 0
      this.total = total
    },

    // 切换分页
    changePage (curPage) {
      // 获取当前页数据
      // this.getGoodsList(curPage)

      // 在此处，让浏览器地址栏中的哈希值变为 当前页 对应的哈希值就可以了
      // 比如：点击第 6 页，哈希值变为： /goods/6
      // 比如：点击第 8 页，哈希值变为： /goods/8
      this.$router.push(`/goods/${curPage}`)
    }
  }
}
