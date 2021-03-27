<template>
  <div class="app-container">
    <el-button type="primary" size="small" @click="handleAddRole">添加新角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Key" width="220">
        <!-- slot-scope="scope" 来取得作用域插槽:data绑定的数据 -->
        <!-- scope可以随便替换其他名称，只是定义对象来代表取得的data数据，便于使用 -->
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色的权限':'添加一个新角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="请输入角色名称..." />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色描述..."
          />
        </el-form-item>
        <el-form-item label="角色权限">
          <!--
              element ui 树形控件
              1、:data：
                  表示填充的数据
              2、show-checkbox：
                  表示节点是否可被选择
              3、check-strictly：
                  表示在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false。
          -->
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">返回</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, getAllRoles, getOneVORoles, addRole, deleteRole, updateRole } from '@/api/role'

// 添加新角色时的默认信息
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: 从服务器获取所有路由和角色列表
    // 打开角色权限页面即加载：
    // 1、routes（当前所有的恒定路由和动态路由）
    // 2、roles（项目所有的用户角色）
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()

      console.log('得到的全部菜单数据')
      console.log(res)

      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },
    async getRoles() {
      const res = await getRoles()

      /* const res = await getAllRoles()
      const oneRole = await getOneVORoles(3)
      let oneRoute = oneRole.data.routes
      for (let role of res.data) {
        /!*role.routes = [
          {
            path: '/permission',
            component: 'layout/Layout',
            redirect: '/permission/index',
            alwaysShow: true,
            meta: {
              title: '权限~',
              icon: 'lock'
            },
            children: [
              {
                path: 'page',
                component: 'views/permission/page',
                name: 'PagePermission',
                meta: {
                  title: '页面权限',
                  roles: ['admin']
                }
              },
              {
                path: 'directive',
                component: 'views/permission/directive',
                name: 'DirectivePermission',
                meta: {
                  title: '指令权限'
                }
              },
              {
                path: 'role',
                component: 'views/permission/role',
                name: 'RolePermission',
                meta: {
                  title: '角色权限',
                  roles: ['admin']
                }
              }
            ]
          }
        ]*!/
        role.routes = oneRoute
      }*/

      this.rolesList = res.data
    },

    // 重塑路由结构，使其看起来与侧边栏相同
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (let route of routes) {
        // 跳过一些路由
        if (route.hidden) {
          continue
        }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          // path.resolve()方法 将一些的 路径/路径段 解析为 绝对路径。
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }
        // 递归子路径
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },

    // 根据重塑的路由结构，生成一个：应该被选中节点的array
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },

    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      // this.$nextTick()方法 主要是用在随数据改变而改变的dom应用场景中
      // vue中数据和dom渲染由于是异步的，
      // 所以，要让dom结构随数据改变这样的操作都应该放进this.$nextTick()的回调函数中。
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        // $refs代表一个引用
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // 设置节点的选中状态不会影响其父节点和子节点
        this.checkStrictly = false
      })
    },

    handleDelete({ $index, row }) {
      this.$confirm('确认删除角色？', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '返回',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },

    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },

    // 添加/修改 通知
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.role.key, this.role)
        for (let index = 0; index < this.rolesList.length; index++) {
          if (this.rolesList[index].key === this.role.key) {
            this.rolesList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.key = data.key
        this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },

    // reference: src/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // 如果只有一条子路线，则默认显示该子路线（不用嵌套父、子路线）
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        // path.resolve
        // 作用：该方法将一些的 路径/路径段 解析为 绝对路径。
        // 完成如：xxx/parent/children --> xxx/children 的转换。
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // 如果没有子路线可显示，则显示父路线
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
