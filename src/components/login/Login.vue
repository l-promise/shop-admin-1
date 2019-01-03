<template>
  <div class="login">
    <!--
      表单组件：

      el-form 表单组件
        :model="loginForm" 表单数据对象
        :rules="rules" 表单验证规则
        label-width="100px" 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值
        class="demo-loginForm" 样式，带有 demo 样式，一般都不起作用
        label-position="top" 设置表单域标签的位置，设置为 顶部

        ref="loginForm"

      el-form-item 表单中的每一行组件
        label="活动名称" 标签文本（表单中每一个表单项的描述文字）
        prop="name" 表单域 model 字段，在使用 validate（表单校验）、resetFields（重置表单） 方法的情况下，该属性是必填的

      el-input 文本框组件
        v-model="loginForm.name" 实现双向数据绑定
      el-button 按钮组件
        type="primary" 设置按钮的样式类型
    -->
    <!--
      el-row 表示每一行
        type="flex" 启动flex布局
        justify="center" 用来设置主轴对其方式

      el-col 表示每一列
        :span="6" 栅格占据的列数，默认值为 24 ，也就是说没有指定 span 属性，表示沾满整行
    -->
    <el-row type="flex" justify="center" align="middle" class="login-row">
      <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="login-form"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
            <el-button @click="resetForm('loginForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- <button ref="myBtn">按钮</button> -->
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  data () {
    return {
      // 表单数据对象
      loginForm: {
        // 用户名
        username: 'admin',
        // 密码
        password: '123456'
      },
      // 表单验证规则
      rules: {
        // name 就是要校验的数据
        username: [
          // required 表示必填项
          // message 表示验证失败时要展示的错误信息
          // trigger 表示触发表单验证的时机
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // min 和 max 配合类设置长度
          {
            min: 5,
            max: 12,
            message: '用户名长度为5到12个字符',
            trigger: 'blur'
          }
        ],

        password: [
          // required 表示必填项
          // message 表示验证失败时要展示的错误信息
          // trigger 表示触发表单验证的时机
          { required: true, message: '请输入密码', trigger: 'blur' },
          // min 和 max 配合类设置长度
          { min: 6, max: 12, message: '密码长度为6到12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单提交的代码逻辑
    async submitForm (formName) {
      // validate() 如果不传递回调函数，则返回一个Promise对象
      // 如果表单验证成功，则 valid 值为：true
      // 如果表单验证失败，则会执行 catch 中的代码，并且错误对象 e 值为：false
      /* try {
        const valid = await this.$refs[formName].validate()

        // 如果表单验证失败，那么，后面的代码不会继续执行
        console.log('成功：', valid)
      } catch (e) {
        console.log('表单验证失败了', e)
      } */

      try {
        // 表单验证
        await this.$refs[formName].validate()

        // 表单验证成功后，发送请求，完成登录功能
        const res = await axios.post(
          'http://localhost:8888/api/private/v1/login',
          this.loginForm
        )

        if (res.data.meta.status === 200) {
          localStorage.setItem('token', res.data.data.token)
          this.$router.push({ name: 'home' })
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      } catch (e) {}

      /* this.$refs[formName].validate(async valid => {
        if (!valid) {
          return false
        }

        // 表单验证成功
        const res = await axios.post(
          'http://localhost:8888/api/private/v1/login',
          this.loginForm
        )

        if (res.data.meta.status === 200) {
          localStorage.setItem('token', res.data.data.token)
          this.$router.push({ name: 'home' })
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error',
            duration: 1000
          })
        }
      }) */
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.login {
  height: 100%;
  background-color: #2d434c;
}

.login-row {
  height: 100%;
}

.login-form {
  min-width: 380px;
  padding: 30px 20px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
