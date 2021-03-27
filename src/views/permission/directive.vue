<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />

    <div :key="key" style="margin-top:30px;">
      <div>
        <span v-permission="['SUPERADMIN']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">SUPERADMIN</el-tag> 可以看到这则消息
        </span>
        <el-tag v-permission="['SUPERADMIN']" class="permission-sourceCode" type="info">
          v-permission="['SUPERADMIN']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['ADMIN']" class="permission-alert">
          只有
          <el-tag class="permission-tag" size="small">ADMIN</el-tag> 可以看到这则消息
        </span>
        <el-tag v-permission="['ADMIN']" class="permission-sourceCode" type="info">
          v-permission="['ADMIN']"
        </el-tag>
      </div>

      <div>
        <span v-permission="['SUPERADMIN','ADMIN']" class="permission-alert">
          <el-tag class="permission-tag" size="small">SUPERADMIN</el-tag> 和
          <el-tag class="permission-tag" size="small">ADMIN</el-tag> 都可以看到这则消息
        </span>
        <el-tag v-permission="['SUPERADMIN','ADMIN']" class="permission-sourceCode" type="info">
          v-permission="['SUPERADMIN','ADMIN']"
        </el-tag>
      </div>
    </div>

    <div :key="'checkPermission'+key" style="margin-top:60px;">
      <aside>
        In some cases, using v-permission will have no effect. For example: Element-UI's Tab component or
        el-table-column and other scenes that dynamically render dom. You can only do this with v-if.
        （在某些情况下，使用v-permission将无效。例如：Element-UI Tab组件或el-table-column以及动态渲染dom的其他场景。您只能使用v-if执行此操作。）
        <br> e.g.
      </aside>

      <el-tabs type="border-card" style="width:550px;">
        <el-tab-pane v-if="checkPermission(['SUPERADMIN'])" label="SUPERADMIN">
          超级管理员可以看到这个
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['SUPERADMIN'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['ADMIN'])" label="ADMIN">
          管理员可以看到这个
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['ADMIN'])"
          </el-tag>
        </el-tab-pane>

        <el-tab-pane v-if="checkPermission(['SUPERADMIN','ADMIN'])" label="SUPERADMIN-OR-ADMIN">
          超级管理员或管理员都可以看到此内容
          <el-tag class="permission-sourceCode" type="info">
            v-if="checkPermission(['SUPERADMIN','ADMIN'])"
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'DirectivePermission',
  components: { SwitchRoles },
  directives: { permission },
  data() {
    return {
      // 为了能每次切换权限的时候重新初始化指令
      key: 1
    }
  },
  methods: {
    checkPermission,
    handleRolesChange() {
      this.key++
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  ::v-deep .permission-alert {
    width: 320px;
    margin-top: 15px;
    background-color: #f0f9eb;
    color: #67c23a;
    padding: 8px 16px;
    border-radius: 4px;
    display: inline-block;
  }

  ::v-deep .permission-sourceCode {
    margin-left: 15px;
  }

  ::v-deep .permission-tag {
    background-color: #ecf5ff;
  }
}
</style>

