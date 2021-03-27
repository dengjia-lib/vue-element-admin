<template>
  <el-form>
    <el-form-item label="请输入旧密码">
      <el-input v-model="pwd.oldPwd" />
    </el-form-item>
    <el-form-item label="请输入新密码">
      <el-input v-model="pwd.newPwd" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
    submit() {
      this.$notify({
        title: 'SUCCESS',
        dangerouslyUseHTMLString: true,
        message: '用户<strong><i> XXX </i></strong>信息已成功更新',
        offset: 100,
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
