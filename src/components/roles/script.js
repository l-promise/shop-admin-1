export default {
  data () {
    return {
      // 角色列表数据
      roleList: [],

      // 控制分配权限对话框的展示和隐藏
      isShowRightsDialog: false,

      // 权限树形数据：
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },

      // 当前角色id
      curRoleId: -1
    }
  },

  created () {
    this.getRoleList()
    this.getRightsTree()
  },

  methods: {
    // 获取角色列表数据
    async getRoleList () {
      const res = await this.$http.get('/roles')
      this.roleList = res.data.data
    },

    // 自定义索引号：
    getIndex (index) {
      // 注意：index 是从0开始的
      // console.log('index', index)
      return index + 1
    },

    // 展示分配权限对话框
    showRightsDialog (curRole) {
      // 展示对话框
      this.isShowRightsDialog = true

      // 获取到roleId
      // 暂存，点击确定的时候，会用到这个id
      this.curRoleId = curRole.id

      // console.log('curRole', curRole)
      const checkedKeys = []

      // 打开对话框的时候，应该选中当前角色拥有的权限
      // 选中的时候，只需要选择 叶子节点（三级权限） 即可
      // 步骤：
      // 1 获取到所有的叶子节点
      // 遍历一级权限
      curRole.children.forEach(level1 => {
        // 遍历二级
        level1.children.forEach(levle2 => {
          // 遍历三级
          levle2.children.forEach(level3 => {
            checkedKeys.push(level3.id)
          })
        })
      })

      // 2 调用 tree 中提供的 this.$refs.tree.setCheckedKeys([3]) 来选中节点
      //   参数是一个数组，数组中每一项就是 叶子节点 的key（ 也就是节点的id集合 ）
      /*
        为什么获取不到 tree 组件？
          因为 tree 是在dialog对话框中的，对话框默认是隐藏的（隐藏时通过 v-if 来实现的，也就是隐藏的时候，组件不会被渲染）。因为 对话框组件 没有渲染，所以， tree 组件也就是没有被渲染。所以， ref 就无效，因此，无法直接通过 this.$refs.tree 来获取到 tree组件

        为什么将 控制对话框展示和隐藏的数据 isShowRightsDialog 设置为true，还是拿不到 tree 组件？
          因为 Vue 中的DOM是异步更新的，也就是说：数据变化后，DOM没有立即更新，而是延迟执行了，所以，数据虽然变了，但是 DOM 还没有被立即更新，所以，无法获取到 tree 组件

        如何获取到tree组件？
          只要调用 $nextTick() 方法，在回调函数中再获取 tree 就可以获取到了
          因为 $nextTick 中的回调函数，会在DOM渲染后，立即调用，所以，当 回调函数 执行的时候，tree组件已经完成渲染，此时，就可以获取到的 tree 了
      */

      // 问题：无法直接通过 $refs.tree 获取到树形组件
      // console.log(this.$refs, this.$refs.tree)
      this.$nextTick(() => {
        // console.log(this.$refs.tree)
        // 设置选中
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })
    },

    // 获取权限列表 tree 结构
    async getRightsTree () {
      const res = await this.$http.get('/rights/tree')
      this.rightsTree = res.data.data
    },

    // 给角色分配权限
    async assignRights () {
      // 获取所有选中的节点id
      // 注意：不仅要获取到全选中的key，还要获取到半选中的key，因为，三级菜单属于二级，也就是说：没有 二级就没有三级，没有一级就没有二级
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // const allKeys = checkedKeys.concat(halfCheckedKeys)
      const allKeys = [...checkedKeys, ...halfCheckedKeys]

      // 获取到 roleId？？？
      // this.curRoleId
      const res = await this.$http.post(`/roles/${this.curRoleId}/rights`, {
        rids: allKeys.join(',')
      })

      // 成功后：
      // 1 关闭对话框
      this.isShowRightsDialog = false
      // 2 提示成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      // 3 重新获取列表数据
      this.getRoleList()
    },

    // 删除角色指定权限
    async delRights (roleId, rightId) {
      const res = await this.$http.delete(`/roles/${roleId}/rights/${rightId}`)
      // 1 提示成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
      // 2 重新获取列表数据
      this.getRoleList()
    }
  }
}
