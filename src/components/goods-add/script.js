// 导入富文本编辑器组件
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },

  data () {
    return {
      // 步骤条当前索引号
      active: 0,

      // tab 栏选中项的值
      tabActive: 'basic',

      // 商品添加数据对象：
      goodsAddForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        // 上传图片文件的临时路径数组
        pics: [],

        // 商品分类选中项数组
        goods_cat_add: [],
        // 是否促销：
        is_promote: false
      },

      // 分类列表数据
      cateList: [],
      // 上传文件的请求头
      headers: {
        Authorization: localStorage.getItem('token')
      },

      htmlStr: '<h1 class="test-html">这是通过 v-html 动态生成的结构</h1>'
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    // tab页切换事件
    tabChange (tab) {
      // 参数 tab 表示：当前的 tab 实例（组件），通过 tab.index 就可以获取到的当前组件的索引号
      // console.log('tabChange', tab)
      this.active = tab.index - 0
    },

    // 同时切换 步骤条 和 tab栏
    next (active, tabActive) {
      this.active = active
      this.tabActive = tabActive
    },

    // 获取分类列表数据
    async getCateList () {
      const res = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })

      this.cateList = res.data.data
    },

    // 上传图片文件成功时的回调函数
    onSuccess (response, file, fileList) {
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      })
    },

    // 添加商品
    async addGoods () {
      /* eslint-disable */
      const {
        goods_name,
        goods_cat_add,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        is_promote
      } = this.goodsAddForm

      const res = await this.$http.post('/goods', {
        goods_name,
        goods_cat: goods_cat_add.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
        is_promote
      })

      // 提示成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      // 跳转到商品列表页面
      this.$router.push('/goods')
    }
  }
}
