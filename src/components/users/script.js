// 导入axios
// import axios from 'axios'

export default {
  // 进入页面，发送请求，获取数据
  created () {
    this.getUserList()

    // 获取所有角色列表数据
    this.getRoleList()
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
      pagesize: 3,
      // 搜索条件
      searchText: '',

      // 控制添加用户对话框的展示和隐藏
      isShowUserAddDialog: false,

      // 添加用户数据
      userAddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 添加用户 - 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '用户名长度为5到12个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为6到12个字符', trigger: 'blur' }
        ],
        email: [
          // 通过 pattern 来指定一个正则表达式来对表单进行验证
          {
            pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            pattern: /^1(3|4|5|7|8)\d{9}$/,
            message: '手机号码格式不正确',
            trigger: 'blur'
          }
        ]
      },

      // 编辑用户数据
      isShowUserEditDialog: false,
      userEditForm: {
        id: '',
        email: '',
        mobile: '',

        // 显示数据：
        username: ''
      },

      // 控制分配角色对话框的展示和隐藏
      isShowRoleDialog: false,
      // 角色列表数据
      roleList: [],
      // 给用户分配角色表单数据对象
      roleForm: {
        userName: '',
        rid: -1,
        // 暂存userId
        userId: -1
      }
    }
  },

  methods: {
    // 分页获取数据
    async getUserList (pagenum = 1, query = '') {
      const url = 'http://localhost:8888/api/private/v1/users'
      const options = {
        params: {
          // 查询条件
          query,
          // 当前页
          pagenum,
          // 每页大小
          pagesize: 3
        }
        // 通过请求头，传递token
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }

      // 使用 await 等待Promise结果
      const res = await this.$http.get(url, options)
      // console.log('用户列表数据：', res)
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
      // 因为现在有了查询功能，分页的时候，应该按照当前查询条件来查询数据
      this.getUserList(curPage, this.searchText)
    },

    // 切换用户状态
    async changeUserState (user) {
      try {
        // 手动抛出异常：
        // throw new Error('报错了')

        const res = await this.$http.put(
          `/users/${user.id}/state/${user.mg_state}`,
          null,
          {
            // headers: {
            //   Authorization: localStorage.getItem('token')
            // }
          }
        )

        if (res.data.meta.status === 200) {
          // 表示设置用户状态成功：
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 1000
          })
        } else {
          // 表示设置用户状态失败：
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
        }
      } catch (er) {
        // 上面异步操作代码出错了，才会执行 catch 中的代码逻辑
        // console.log(er)
        this.$message({
          type: 'error',
          message: '设置状态失败'
        })

        // 如果修改失败，就重置当前用户的状态
        // user.mg_state = !user.mg_state
      }
    },

    // 查询数据
    search () {
      // 默认查询第一页的数据
      this.getUserList(1, this.searchText)
    },

    // 根据用户id删除数据
    async delUserById (id) {
      // 弹出确认对话框
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 发送请求，删除数据
        const res = await this.$http.delete(`/users/${id}`)
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })

          // 刷新列表数据
          this.getUserList(1, this.searchText)
        } else {
          this.$message({
            type: 'warning',
            message: res.data.meta.msg
          })
        }
      } catch (er) {
        // 点击取消按钮
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      }
    },

    // 展示用户添加对话框
    showUserAddDialog () {
      this.isShowUserAddDialog = true
    },

    // 添加用户
    async addUser () {
      try {
        // 1 先进行表单验证
        await this.$refs.userAddFormRef.validate()

        // 2 再进行添加用户逻辑
        const res = await this.$http.post('/users', this.userAddForm)

        if (res.data.meta.status === 201) {
          // 1 关闭对话框
          this.isShowUserAddDialog = false

          // 2 提示用户添加成功
          this.$message({
            type: 'success',
            message: res.data.meta.msg
          })

          // 3 重新获取列表数据
          this.getUserList(1, this.searchText)
        }
      } catch (error) {
        // 表单验证失败
      }
    },

    // 隐藏用户添加对话框
    hideUserAddDialog () {
      // 重置表单
      this.$refs.userAddFormRef.resetFields()
    },

    // 展示用户编辑对话框
    showUserEditDialog (user) {
      this.isShowUserEditDialog = true

      // 因为展示编辑对话框的时候，要展示用户数据，所以，
      // 在这，通过 参数user 将数据赋值给 编辑对话框 的数据就可以了
      // console.log(user)
      for (let key in this.userEditForm) {
        this.userEditForm[key] = user[key]
      }

      // this.userEditForm.username = user.username
      // this.userEditForm.id = user.id
      // this.userEditForm.email = user.email
      // this.userEditForm.mobile = user.mobile
    },

    // 编辑用户
    async updateUser () {
      // 解构
      const { id, email, mobile } = this.userEditForm

      const res = await this.$http.put(`/users/${id}`, {
        email,
        mobile
      })

      // 解构
      const {
        meta: { status, msg: message }
      } = res.data

      if (status === 200) {
        // 关闭对话框
        this.isShowUserEditDialog = false
        // 提示用户编辑用户成功
        this.$message({
          type: 'success',
          message
        })
        // 刷新列表数据
        this.getUserList(this.pagenum, this.searchText)
      }
    },

    // 展示分配角色对话框
    showRoleDialog (curUser) {
      this.isShowRoleDialog = true

      const role = this.roleList.find(
        item => item.roleName === curUser.role_name
      )

      // 注意：admin用户的角色是 超级管理员 ，这个角色不在角色列表中，所以，需要判断 role是否存在，如果存在就获取 role.id；如果不存在，就设置默认值 ''
      const rid = role ? role.id : ''
      // console.log(rid)

      // 设置 用户名默认值和角色下拉框默认选中
      this.roleForm.userName = curUser.username
      this.roleForm.rid = rid
      this.roleForm.userId = curUser.id
    },

    // 获取所有的角色列表数据
    async getRoleList () {
      const res = await this.$http.get('/roles')
      this.roleList = res.data.data
    },

    // 给用户分配角色
    async assignRole () {
      const { userId, rid } = this.roleForm
      const res = await this.$http.put(`/users/${userId}/role`, {
        rid
      })

      // 1 关闭对话框
      this.isShowRoleDialog = false
      // 2 提示成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      // 3 刷新列表数据
      this.getUserList(this.pagenum, this.searchText)
    }
  }
}
