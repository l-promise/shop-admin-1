export default {
  data () {
    return {
      // 分类列表数据
      cateList: [],
      // 总条数
      total: 0,
      // 当前页
      pagenum: 0,
      // 每页大小
      pagesize: 5,

      // 加载中效果
      loading: false,

      isShowCateAddDialog: false,
      // 添加分类的表单对象数据：
      cateAddForm: {
        // 级联选择器的数据
        catPidArr: [],
        // 分类名称
        cat_name: ''
      },
      // 添加分类时用到的 一级和二级分类 数据列表
      cateAddList: []
      /* options: [
        {
          // 每个选择的值，是给程序使用的
          value: 'ziyuan',
          // 通过 label 属性，来作为当前 选项的名称，是给用户看的
          label: '资源',
          // children属性指定子级分类
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ] */
    }
  },

  created () {
    this.getCateList()

    // 获取添加分类时用到的 一级和二级分类数据
    this.getCateAddList()
  },

  methods: {
    // 获取分类列表
    async getCateList (curPage = 1) {
      // 开启加载中效果：
      this.loading = true

      const res = await this.$http.get('/categories', {
        params: {
          type: 3,
          pagenum: curPage,
          pagesize: 5
        }
      })
      // console.log(res)
      const { result, pagenum, total } = res.data.data
      this.cateList = result
      this.pagenum = pagenum + 1
      this.total = total

      // 关闭加载中效果：
      this.loading = false
    },

    // 切换分页
    changePage (curPage) {
      this.getCateList(curPage)
    },

    // 展示添加分类对话框
    showCateAddDialog () {
      this.isShowCateAddDialog = true
    },

    // 获取添加分类时用到的 一级和二级分类数据
    async getCateAddList () {
      const res = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      })

      this.cateAddList = res.data.data
    },

    // 添加分类
    async addCate () {
      /*
        cat_pid 分类父ID 不能为空
          父ID 应该是当前要添加的分类的直接父级，所以，应该获取 所有选中项 中的最后一项

        cat_name 分类名称 不能为空
        cat_level 分类层级 不能为空
          一级分类的 level 为：0
          二级分类的 level 为：1
          三级分类的 level 为：2
          可以用过 级联选择器数组长度 来作为层级
      */

      // const { cat_name: catName } = this.cateAddForm

      // 告诉 ESLint 不要使用 camelcase 规则，来校验下一行代码
      /* eslint-disable camelcase */
      const { cat_name, catPidArr } = this.cateAddForm
      // console.log(cat_name, catPidArr[catPidArr.length - 1], catPidArr.length)
      const res = await this.$http.post('/categories', {
        cat_pid: catPidArr[catPidArr.length - 1],
        cat_name,
        cat_level: catPidArr.length
      })

      // console.log(res)
      // 关闭对话框
      this.isShowCateAddDialog = false
      // 提示成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      // 刷新列表数据
      this.getCateList()
    }
  }
}
