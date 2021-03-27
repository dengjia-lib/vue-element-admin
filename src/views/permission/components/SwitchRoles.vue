<template>
  <div>
    <div style="margin-bottom:15px;">
      您当前的角色: {{ roles }}
    </div>
    切换角色:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="VISITOR" />
      <el-radio-button label="ADMIN" />
      <el-radio-button label="SUPERADMIN" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          // vue中子组件跟父组件通信this.$emit()
          this.$emit('change')
        })
      }
    }
  }
}
</script>
