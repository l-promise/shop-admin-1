<template>
  <div class="users">
    <!--
      表格组件：
        :data="tableData" 指定表格的数据源
        stripe 启用斑马纹（隔行变色效果）

      el-table-column 表格列组件
        prop="date" 对应列内容的字段名，也就是数据源中的属性名
        label="日期" 列标题名称
          如果列没有直接展示数据源中的数据，就可以不用传递prop属性
        width="180" 列宽度
    -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="用户状态"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <!--
      分页组件
        background 设置分页组件背景色
        layout="prev, pager, next" 分页组件结构
        :total="1000" 总条数
        :page-size="3" 每页条数（大小）
        :current-page="10" 当前页
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  // 进入页面，发送请求，获取数据
  created () {
    this.getUserList()
  },

  data () {
    return {
      // 用户列表数据
      userList: [],
      // 总条数：
      total: 0,
      // 当前页：
      pagenum: 1,
      // 每页大小：
      pagesize: 3
    }
  },

  methods: {
    // 分页获取数据
    async getUserList (pagenum = 1) {
      const url = 'http://localhost:8888/api/private/v1/users'
      const options = {
        params: {
          // 查询条件
          query: '',
          // 当前页
          pagenum,
          // 每页大小
          pagesize: 3
        },
        // 通过请求头，传递token
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }

      // 使用 await 等待Promise结果
      const res = await axios.get(url, options)
      console.log('用户列表数据：', res)
      if (res.data.meta.status === 200) {
        // 获取数据成功
        this.userList = res.data.data.users
        // 设置总条数：
        this.total = res.data.data.total
        // 设置当前页
        this.pagenum = res.data.data.pagenum
      } else {
        // 失败
        // token失效

        // 跳回到登录页面
        this.$router.push('/login')
        // 清除token
        localStorage.removeItem('token')
      }
    },

    // 切换分页，获取当前页数据
    changePage (curPage) {
      // console.log('切换分页了：', curPage)
      this.getUserList(curPage)
    }
  }
}
</script>

<style>
</style>
