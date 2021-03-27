<template>
  <el-form>
    <el-form-item label="真实姓名">
      <el-input v-model.trim="user.realName" />
    </el-form-item>
    <el-form-item label="自我介绍">
      <el-input v-model.trim="user.introduction" />
    </el-form-item>
    <el-form-item label="我的邮箱">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新资料</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { modifyUser } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          realName: '',
          email: '',
          introduction: ''
        }
      }
    }
  },
  methods: {
    submit() {
      const user = this.user
      const data = {
        id: user.id,
        realName: user.realName,
        userEmail: user.email,
        remark: user.introduction
      }
      console.log(data)
      new Promise((resolve, reject) => {
        modifyUser(data)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$notify({
                title: 'SUCCESS',
                message: '用户资料已成功更新',
                offset: 100,
                type: 'success',
                duration: 5 * 1000
              })
              : this.$notify({
                title: 'FAILURE',
                message: '用户资料更新失败，请检查后重新提交。',
                offset: 100,
                type: 'warning',
                duration: 5 * 1000
              })
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>
