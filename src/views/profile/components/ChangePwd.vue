<template>
  <el-form>
    <el-form-item label="请输入旧密码">
      <el-input v-model="pwd.oldPwd" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="请输入新密码">
      <el-input v-model="pwd.newPwd" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitChangePwd">更改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changePwd } from '@/api/user'

export default {
  props: {
    pwd: {
      type: Object,
      default: () => {
        return {
          oldPwd: '',
          newPwd: ''
        }
      }
    }
  },
  methods: {
    submitChangePwd() {
      const pwd = this.pwd
      const data = {
        oldPwd: pwd.oldPwd,
        newPwd: pwd.newPwd
      }
      new Promise((resolve, reject) => {
        changePwd(data)
          .then(resp => {
            const isSuccess = resp.data === 1
            isSuccess
              ? this.$notify({
                title: 'SUCCESS',
                message: '密码修改成功！',
                offset: 100,
                type: 'success',
                duration: 5 * 1000
              })
              : this.$notify({
                title: 'FAILURE',
                message: '原始密码错误，修改失败！',
                offset: 100,
                type: 'warning',
                duration: 5 * 1000
              })
            //  提交修改密码表单后后 清空表单
            this.pwd.oldPwd = ''
            this.pwd.newPwd = ''
          })
          .catch(err => {
            reject(err)
          })
      })

      // this.$notify({
      //   title: 'SUCCESS',
      //   dangerouslyUseHTMLString: true,
      //   message: '用户<strong><i> XXX </i></strong>信息已成功更新',
      //   offset: 100,
      //   type: 'success',
      //   duration: 5 * 1000
      // })
    }
  }
}
</script>
