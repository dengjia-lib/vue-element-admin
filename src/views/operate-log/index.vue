<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.sort" size="mini" style="width: 130px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        &emsp;
        <el-button
          v-waves
          size="mini"
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          导出
        </el-button>
      </div>
      <!-- 用户列表展示信息（table） -->
      <!-- :key="Math.random()" -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="正在请求用户数据"
        :data="logTableData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="id"
          label="ID"
          sortable="custom"
          align="center"
          width="70"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operater" label="操作员" align="center" />
        <el-table-column prop="operand" label="操作对象" align="center" />
        <el-table-column prop="operate" label="具体操作" align="center" />
        <el-table-column prop="operateTime" align="center" label="操作时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span> {{ scope.row.operateTime }}</span>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页导航条 -->
      <el-pagination
        background
        layout="prev, pager, next, jumper, sizes"
        :hide-on-single-page="isPageSinglePage"
        :current-page.sync="currentPage"
        :page-size="currentSize"
        :page-sizes="arrays"
        :pager-count="13"
        :total="total"
        @current-change="handleCurrentPageChange"
        @size-change="handlePageSizeChange"
      />
      <!-- pv -->
      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios'
import { getLogList, getRoomInfo, getRoleInfo, fetchUserListByQuery } from '@/api/table'
import { getUserById, modifyUser, deleteUser, addUser } from '@/api/user'
import permission from '@/directive/permission'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'LogTable',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const validateLoginPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userDetailAddForm.checkLoginPwd !== '') {
          this.$refs.ruleForm.validateField('checkLoginPwd')
        }
        callback()
      }
    }
    const validateCheckLoginPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userDetailAddForm.loginPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateUserRole = (rule, value, callback) => {
      if (this.selectedRoles.length === 0) {
        callback(new Error('请选择用户角色！'))
      } else {
        callback()
      }
    }
    const checkUserPhone = (rule, value, callback) => {
      // const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      const phoneReg = /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/
      if (value === '') {
        return callback(new Error('请输入手机号'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入11位数字'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的手机号码格式'))
          }
        }
      }, 100)
    }
    const checkUserEmail = (rule, value, callback) => {
      // const mailReg = /^([a-zA-Z0-9]+[|-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[|-|.]?)*[a-zA-Z0-9]+(.[a-zA-Z]{2,3})+$/
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('请输入电子邮箱'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return {
      headers: {
        token: localStorage.getItem('user_token')
      },
      avatarApi: 'http://localhost:8080/user/upload/avatar',
      avatarUrl: '',
      // 当前页面所有用户的简略信息
      logTableData: null,
      /* tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ],*/
      allUserTags: [
        {
          oneUserTags: [
            {
              /* oneTag: [{ */'name': '', 'type': ''/* }]*/
            }
          ]
        }],
      // 详细的表单信息，用于填充详细信息表单 和 修改表单的默认信息
      detailForm: {
        id: null,
        loginName: '',
        loginPwd: '',
        checkLoginPwd: '',
        realName: '',
        userSex: 3,
        userRole: null,
        userRoom: null,
        userPhone: '',
        userEmail: '',
        createTime: null,
        loginTime: null,
        lastLoginTime: null,
        loginCount: null,
        userPicture: '',
        remark: ''
      },
      // 详细的表单信息，添加表单
      userDetailAddForm: {
        id: null,
        loginName: '',
        loginPwd: '',
        checkLoginPwd: '',
        realName: '',
        userSex: 3,
        userRole: null,
        userRoom: null,
        userPhone: '',
        userEmail: '',
        createTime: null,
        loginTime: null,
        lastLoginTime: null,
        loginCount: null,
        userPicture: '',
        remark: ''
      },
      /* roomInfo: {
        id: null,
        roomName: [],
        roomDesc: null
      },*/
      roomInfo: [],
      // roomIndex: [],
      selectedRoles: [],
      roleInfo: [],

      /* 有关分页导航条的信息 */
      isPageSinglePage: true, // 查询的所有数据只有一页？true：隐藏导航条；false：展示导航条。
      total: null, // 总共的记录条数
      pages: this.$store.state.pages, // 共有多少页
      currentPage: this.$store.state.currentPage, // 第一次请求默认就是第1页，取5条数据展示在第1页
      currentSize: this.$store.state.currentSize, // 指定当前页需要展示多少条数据
      arrays: [3, 5, 9, 11, 15, 20, 100], // 指定每一页显示多少条数据

      /* 框架自带 */
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: undefined,
        limit: undefined,
        userKeyWord: undefined,
        userRole: undefined,
        userRoom: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      // 用户信息表单校验规则
      userInfoRules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        userSex: [{ required: false }],
        userRole: [{ validator: validateUserRole, required: true, message: '请选择用户角色', trigger: 'blur' }],
        loginPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,18}$/,
            message: '密码必须由字母、数字组成，区分大小写，长度为6-18位',
            trigger: 'blur'
          }
        ],
        checkLoginPwd: [{ validator: validateCheckLoginPwd, required: true, trigger: 'blur' }],
        userRoom: [{ required: true, message: '请选择用户负责设备库', trigger: 'change' }],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/,
            message: '请输入正确的手机号码格式'
          }
        ],
        userEmail: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: '请输入正确的电子邮箱格式'
          }
        ],
        remark: [{ required: false }]
      },
      downloadLoading: false
    }
  },
  computed: {
    adminOrSuper() {
      const roles = this.selectedRoles
      for (const role of roles) {
        if (role === 'SUPERADMIN' || role === 'ADMIN') {
          return true
        }
      }
      return false
    }
  },
  created() {
    this.getList()
    // 进入日志列表页面，自动加载日志分页数据。
    this.getLogList(this.currentPage, this.currentSize)

    this.getRoomInfo()
    this.getRoleInfo()
  },
  methods: {
    // 加载列表操作
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // 模拟请求时间
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    // getLogList()
    getLogList(page, size) {
      new Promise((resolve, reject) => {
        getLogList({ page: page, limit: size })
          .then(resp => {
            this.backendTransferToFrontend(resp)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getUserPage(page, size) {
      new Promise((resolve, reject) => {
        getLogList({ page: page, limit: size })
          .then(resp => {
            this.backendTransferToFrontend(resp)
            // 是单页数据吗？
            // this.isPageSinglePage = resp.data.total > 0
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getRoomInfo()
    getRoomInfo() {
      new Promise((resolve, reject) => {
        getRoomInfo()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.roomInfo[i] = resp.data[i].roomName
              resolve(resp)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // getRoleInfo() 获取数据库中所有用户角色的信息
    getRoleInfo() {
      new Promise((resolve, reject) => {
        getRoleInfo()
          .then(resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.roleInfo[i] = resp.data[i].roleName.substring(5)
              resolve(resp)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 后台数据 ===> 前端数据
    backendTransferToFrontend(resp) {
      this.total = resp.data.total
      this.pages = resp.data.pages
      this.currentSize = resp.data.size
      this.logTableData = resp.data.records
    },
    getListByQuery() {
      this.listLoading = true
      const query = {
        page: this.currentPage,
        limit: this.currentSize,
        realName: this.listQuery.userKeyWord,
        userRole: this.listQuery.userRole,
        userRoom: this.listQuery.userRoom
      }
      new Promise((resolve, reject) => {
        fetchUserListByQuery(query)
          .then((resp) => {
            this.listLoading = false
            this.backendTransferToFrontend(resp)
            resolve(resp)
          }, (err) => {
            this.listLoading = false
            reject(err)
          })
      })
    },
    getUserRole(row, column) {
      return row.authorities.authority
    },
    // 清空表单数据操作
    resetForm(formName) {
      // this.clearForm()
      // 清空用户已选择的角色
      this.selectedRoles = []
      // 清空表单域和校验规则
      this.$nextTick(() => {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      })
    },
    clearForm() {
      // 隐藏对话框
      this.dialogAddFormVisible = false
      // 表单验证还原
      if (this.$refs['detailForm'] !== undefined) {
        this.$refs['detailForm'].resetFields()
      } else {
        this.$nextTick(() => {
          this.$refs['detailForm'].resetFields()
        })
      }
      // 还原可编辑
      /* this.flag = false*/
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogAddFormVisible = true
      this.$nextTick(() => {
        this.$refs['userDataForm'].clearValidate()
      })
    },
    // 用于添加/修改用户的时候清空表单
    clearUserDetailAddForm() {
      this.detailForm.id = null
      this.detailForm.loginName = ''
      this.detailForm.loginPwd = ''
      this.detailForm.checkLoginPwd = ''
      this.detailForm.realName = ''
      this.detailForm.userSex = 3
      this.detailForm.userRole = null
      this.selectedRoles = []
      this.detailForm.userRoom = null
      this.detailForm.userPhone = ''
      this.detailForm.userEmail = ''
      this.detailForm.createTime = null
      this.detailForm.loginTime = null
      this.detailForm.lastLoginTime = null
      this.detailForm.loginCount = null
      this.detailForm.userPicture = ''
      this.detailForm.remark = ''
    },

    // 处理点击添加按钮的请求
    handleAddUser() {
      // 添加用户之前先清空表单值 和 表单的验证提示信息
      // this.resetForm('userAddDataForm')

      // 清空表单数据
      // this.clearUserDetailAddForm()

      this.$nextTick(() => {
        // // 清空校验信息
        // this.$refs['userAddDataForm'].clearValidate()
        // 清空表单信息
        this.$refs['userAddDataForm'].resetFields()
        // 清空角色信息
        this.selectedRoles = []
      })

      // this.resetForm('detailForm')
      // this.dialogAddFormVisible = true
      /* this.resetTemp()
      this.dialogStatus = 'create'*/
      /* this.$nextTick(() => {
        this.$refs['userAddDataForm'].clearValidate()
      })*/
    },
    // 编辑上传用户头像
    handleFileSuccess(res, file) {
      this.avatarUrl = res.data
    },
    beforeFileUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像/图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像/图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    // 处理提交添加表单请求
    submitAddForm(userAddDataForm) {
      this.$refs[userAddDataForm].validate((valid) => {
        if (valid) {
          // 表单校验通过
          this.userDetailAddForm.loginCount = 1
          this.userDetailAddForm.createTime = new Date().getTime()
          // 设置用户角色
          this.userDetailAddForm.authorities = this.selectedRoles
          // 设置用户默认头像
          this.userDetailAddForm.userPicture = 'http://img.djosimon.top/3d720df516b049a297c384d5c9770514.png'
          new Promise((resolve, reject) => {
            // this.userDetailAddForm.remark += '_' + this.selectedRoles.toString()
            // this.userDetailAddForm.userRole = this.selectedRoles.toString()
            addUser(this.userDetailAddForm)
              .then(resp => {
                console.log('add jump resp')
                console.log(resp)
                const isSuccess = resp.data === true
                this.dialogAddFormVisible = false
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '用户【' + this.userDetailAddForm.loginName + '】添加成功。',
                    type: 'success'
                  })
                  : this.$message({
                    // 失败，给出提示信息
                    showClose: true,
                    message: '用户【' + this.userDetailAddForm.loginName + '】添加失败，请检查后重新提交。',
                    type: 'warning'
                  })
                // 添加用户成功后，应该跳转到最后一页。
                // this.getLogList()
              })
              .catch(err => {
                reject(err)
              })
          })
        } else {
          console.log('错误提交！！')
          return false
        }
      })
    },

    // 处理当前页码的改变，去到页码为：`currentPage`的那一页。
    handleCurrentPageChange(currentPage) {
      this.$store.state.currentPage = currentPage
      const size = this.$store.state.currentSize
      new Promise((resolve, reject) => {
        getLogList({ page: currentPage, limit: size })
          .then((resp) => {
            this.backendTransferToFrontend(resp)
            resolve(resp)
          }, (err) => {
            reject(err)
          })
      })
    },
    // 处理每一页展示数据条数的变换，每一页展示`val`条数据。
    handlePageSizeChange(val) {
      this.$store.state.currentSize = `${val}`
      new Promise((resolve, reject) => {
        getLogList({ page: this.currentPage, limit: `${val}` })
          .then((resp) => {
            this.$store.state.pages = resp.data.pages
            this.backendTransferToFrontend(resp)
            resolve(resp)
          }, (err) => {
            reject(err)
          })
      })
    },

    handleFilter() {
      this.listQuery.page = 1
      // this.getList()
      this.getListByQuery()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    createData() {
      this.$refs['userDataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogAddFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogAddFormVisible = true
      this.$nextTick(() => {
        this.$refs['userDataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['userDataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogAddFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        /* const tHeader = ['ID', '登录名', '性别', '用户角色', '负责设备库']*/
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
