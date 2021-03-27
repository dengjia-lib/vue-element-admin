<template>
  <div>
    <!--    https://www.cnblogs.com/qxxblogs/p/12388482.html-->
    <!-- 背景图片div -->
    <div class="background">
      <img :src="imgSrc" width="100%" style="position: fixed" alt="">
    </div>
    <!-- 登录表单 -->
    <div class="login-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >

        <div class="title-container">
          <h3 class="title">教学基地设备管理系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="off"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="left" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="off"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >登录
        </el-button>

        <div style="position:relative">
          <div class="tips">
            <span>【管理员】</span>
            <span style="margin-right:18px;">用户名 : admin</span>
            <span>密码 : any</span>
          </div>
          <div class="tips">
            <!--          <span style="margin-right:18px;">Username : editor</span>-->
            <span>【普通人】</span>
            <span style="margin-right:18px;">用户名 : editor</span>
            <span>密码 : any</span>
          </div>

          <el-button class="thirdParty-button" type="primary" @click="showDialog=true">
            第三方登录
          </el-button>
        </div>
      </el-form>
      <el-dialog title="第三方登录" :visible.sync="showDialog">
        <!--      can not be simulated on local, so please combine you own business simulation! ! !-->
        不能在本地模拟，因此请结合您自己的业务模拟！！！
        <br>
        <br>
        <br>
        <social-sign />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSignin from './components/SocialSignin'
import axios from 'axios'

export default {
  name: 'Login',
  components: { SocialSignin },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      imgSrc: require('../../assets/images/bg03.jpg'),
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,18}$/,
            message: '密码必须由字母、数字组成，区分大小写，长度为6-18位',
            trigger: 'blur'
          }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: { // 监听路由变化
    // https://www.cnblogs.com/shiningly/p/9471067.html
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          // console.log('query:')
          // console.log(query)
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      // 如果我们需要在最初绑定值的时候也执行函数，则就需要用到immediate属性，需要将immediate设为true。
      immediate: true,
      // 深度监听
      deep: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    /* if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }*/
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    // 检查大写锁定已打开
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 显示/隐藏密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 处理登录请求
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // dispatch 用来触发 vuex 中的 actions
          this.$store.dispatch('user/login', this.loginForm)
            .then((resp) => {
              // alert('登录表单提交成功,并且得到响应,准备跳转路由')
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('错误提交')
          return false
        }
      })
    },
    /* handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((resp) => {
              console.log('resp===>' + resp)
              /!* let isExist = resp.data === 1
              alert(isExist)*!/
              alert('true')
            })
            .catch(() => {
              alert('false')
              this.loading = false
            })
        } else {
          return false
        }
      })
    },*/
    // 处理登录请求
    /* handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let loginName = this.loginForm.username
          let loginPwd = this.loginForm.password
          axios.get('http://localhost:8080/login/' + loginName + '/' + loginPwd)
            .then((resp) => {
              let isExist = resp.data === 1
              // 存在用户再跳转路由
              if (isExist) {
                alert('用户存在,跳转路由.')
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                // this.$router.push({ path: '/' })
              } else {
                alert('用户不存在,给出提示.')
              }
              this.loading = false
            }, (err) => {
              console.log(err)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },*/
    getOtherQuery(query) {
      // console.log('Object.keys(query):')
      // console.log(Object.keys(query))

      // reduce()方法接收一个函数作为累加器(accumulator), 数组中的每个值(从左到右)开始缩减, 最终为一个值.
      // reduce()为数组中每一个元素依次执行的回调函数.
      return Object.keys(query).reduce((acc, cur) => {
        // acc -- 累加( {} ); cur -- 当前元素( redirect )
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
//$bg:#67c23a;
$dark_gray: #889aa4;
$light_gray: #eee;

/*登录页面背景图片*/
.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  z-index: 0;
  position: absolute;
}

.front {
  z-index: 1;
  position: absolute;
}

.login-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      //color: #FAF4D3;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdParty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdParty-button {
      display: none;
    }
  }
}
</style>
