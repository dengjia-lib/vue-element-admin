<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          v-model="listQuery.userKeyWord"
          size="mini"
          placeholder="用户姓名"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.userRole"
          size="mini"
          placeholder="用户角色"
          clearable
          style="width: 130px"
          class="filter-item"
        >
          <el-option v-for="(item,index) in roleInfo" :key="item" :label="item" :value="index+1" />
        </el-select>
        <el-select
          v-model="listQuery.userRoom"
          v-permission="['SUPERADMIN']"
          size="mini"
          placeholder="负责实践室"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option v-for="(item,index) in roomInfo" :key="item" :label="item" :value="index+1" />
        </el-select>
        <el-select v-model="listQuery.sort" size="mini" style="width: 130px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
        &emsp;
        <el-button v-waves size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查找
        </el-button>
        <!--        <template slot-scope="scope">
                  <el-button @click="handleShowUser(scope.row);dialogDetailFormVisible = true" plain size="mini">查看
                  </el-button>
                </template>-->
        <el-button
          v-permission="['ADMIN','SUPERADMIN']"
          size="mini"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleAddUser();dialogAddFormVisible = true"
        >
          添加用户
        </el-button>
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
        <el-checkbox
          v-model="showRealName"
          size="mini"
          class="filter-item"
          style="margin-left:15px;"
          @change="tableKey=tableKey+1"
        >
          显示用户真实姓名
        </el-checkbox>
      </div>
      <!-- 用户列表展示信息（table） -->
      <!-- :key="Math.random()" -->
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="正在请求用户数据"
        :data="userTableData"
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
        <!--        <el-table-column fixed="left" prop="id" label="ID" width="65" align="center"></el-table-column>-->
        <el-table-column prop="loginName" label="登录名" width="110" align="center" />
        <el-table-column v-if="showRealName" prop="realName" label="真实姓名" width="110" align="center">
          <template slot-scope="{row}">
            <span style="font-weight:bold;font-style:italic">{{ row.realName }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="realName" label="真实姓名" width="110" align="center"></el-table-column>-->
        <el-table-column prop="userSex" label="性别" width="50" align="center" />
        <el-table-column prop="userRole" label="用户角色" width="220" align="center" />
        <!--        <el-table-column prop="userRole" label="用户角色" width="220" align="center">
                  <el-tag v-for="(oneUserTags,index) in allUserTags" :key="oneUserTags[0].name" :type="oneUserTags[0].type">
                    {{ oneUserTags[0].name }}
                  </el-tag>
                </el-table-column>-->
        <el-table-column prop="userRoom" label="负责设备库" width="110" align="center" />
        <el-table-column prop="createTime" align="center" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span> {{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="{row,$index}">
            <el-button plain size="mini" @click="handleShowUser(row);dialogDetailFormVisible = true">查看
            </el-button>
            <el-button
              v-permission="['SUPERADMIN','ADMIN']"
              type="primary"
              plain
              size="mini"
              @click="handleModifyUser(row,$index);dialogModifyFormVisible = true"
            >编辑
            </el-button>
            <!--            <el-button @click="handleDeleteUser(scope.row,scope.index)" type="danger" size="mini">删除</el-button>-->
            <el-button
              v-permission="['SUPERADMIN']"
              type="danger"
              size="mini"
              @click="handleDeleteUser(row,$index)"
            >删除
            </el-button>
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

    <!-- 添加新用户 模态框 -->
    <div>
      <el-dialog title="添加用户" :visible.sync="dialogAddFormVisible">
        <el-form
          ref="userDataForm"
          :inline="true"
          status-icon
          :rules="userInfoRules"
          :model="detailForm"
          label-width="100px"
          size="mini"
        >
          <!--          <el-form-item label="用户id" class="change-label-class">
                      <el-input v-model="detailForm.id" hidden></el-input>
                    </el-form-item>-->
          <el-form-item label="登录名" prop="loginName">
            <el-input v-model="detailForm.loginName" />
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="detailForm.realName" />
          </el-form-item>
          <el-form-item label="登录密码" prop="loginPwd">
            <el-input v-model="detailForm.loginPwd" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkLoginPwd">
            <el-input v-model="detailForm.checkLoginPwd" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别" style="width: 100%" prop="userSex">
            <el-radio v-model="detailForm.userSex" :label="1" value="1">男</el-radio>
            <el-radio v-model="detailForm.userSex" :label="2" value="2">女</el-radio>
            <el-radio v-model="detailForm.userSex" :label="3" value="3">保密</el-radio>
          </el-form-item>
          <!--          <el-form-item label="用户角色" style="width: 100%" prop="userRole">
                      <el-select v-model="detailForm.userRole" class="filter-item" placeholder="请选择角色...">
                        <el-option v-for="(item,index) in roleInfo" :key="item" :label="item" :value="index+1"/>
                      </el-select>
                    </el-form-item>-->
          <el-form-item label="用户角色" style="width: 100%" prop="userRole">
            <el-select v-model="selectedRoles" class="filter-item" multiple placeholder="请选择角色...">
              <el-option
                v-for="item in roleInfo"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="负责设备库" style="width: 100%" prop="userRoom">
            <el-select v-model="detailForm.userRoom" class="filter-item" placeholder="请选择设备库...">
              <el-option v-for="(item,index) in roomInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系手机" prop="userPhone">
            <el-input v-model="detailForm.userPhone" />
          </el-form-item>
          <el-form-item label="电子邮箱" prop="userEmail">
            <el-input v-model="detailForm.userEmail" />
          </el-form-item>
          <!--          <el-form-item label="创建时间">
                      <el-input v-model="detailForm.createTime" readonly disabled></el-input>
                    </el-form-item>-->
          <!--          <el-form-item label="登录时间">
                      <el-input v-model="detailForm.loginTime" readonly disabled></el-input>
                    </el-form-item>-->
          <!--          <el-form-item label="上一次登录">
                      <el-input v-model="detailForm.lastLoginTime" readonly disabled></el-input>
                    </el-form-item>-->
          <!--          <el-form-item label="登录次数">
                      <el-input v-model="detailForm.loginCount" readonly disabled></el-input>
                    </el-form-item>-->
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="备注信息..."
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogAddFormVisible = false">返 回</el-button>
          <!--          <el-button @click="clearDetailForm()" size="mini">重 置</el-button>-->
          <el-button size="mini" @click="resetForm('userDataForm')">重 置</el-button>
          <!--          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">添加</el-button>-->
          <el-button type="primary" size="mini" @click="submitAddForm('userDataForm')">添加</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 用户详细信息 模态框 -->
    <div>
      <el-dialog title="详细信息" :visible.sync="dialogDetailFormVisible">
        <el-form ref="detailForm" :inline="true" :model="detailForm" label-width="100px" size="mini">
          <el-form-item label="用户id" class="change-label-class">
            <el-input v-model="detailForm.id" disabled readonly />
          </el-form-item>
          <el-form-item label="登录名">
            <el-input v-model="detailForm.loginName" readonly />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="detailForm.realName" readonly />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="detailForm.userSex" label="男" disabled>男</el-radio>
            <el-radio v-model="detailForm.userSex" label="女" disabled>女</el-radio>
            <el-radio v-model="detailForm.userSex" label="保密" disabled>保密</el-radio>
          </el-form-item>
          <el-form-item label="用户角色">
            <el-select v-model="selectedRoles" multiple placeholder="用户角色列表" disabled>
              <el-option v-for="item in roleInfo" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责设备库">
            <el-input v-model="detailForm.userRoom" readonly />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="detailForm.userPhone" readonly />
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="detailForm.userEmail" readonly />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="detailForm.createTime" readonly />
          </el-form-item>
          <el-form-item label="登录时间">
            <el-input v-model="detailForm.loginTime" readonly />
          </el-form-item>
          <el-form-item label="上一次登录">
            <el-input v-model="detailForm.lastLoginTime" readonly />
          </el-form-item>
          <el-form-item label="登录次数">
            <el-input v-model="detailForm.loginCount" readonly />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
              readonly
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogDetailFormVisible = false">返 回</el-button>
          <el-button type="primary" size="mini" @click="dialogDetailFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑用户信息 模态框 -->
    <div>
      <el-dialog title="编辑用户" :visible.sync="dialogModifyFormVisible">
        <el-form ref="userDataForm" :inline="true" :model="detailForm" label-width="100px" size="mini">
          <el-form-item label="用户id" class="change-label-class">
            <el-input v-model="detailForm.id" disabled readonly />
          </el-form-item>
          <el-form-item label="登录名">
            <el-input v-model="detailForm.loginName" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="detailForm.realName" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="detailForm.userSex" :label="1" value="1">男</el-radio>
            <el-radio v-model="detailForm.userSex" :label="2" value="2">女</el-radio>
            <el-radio v-model="detailForm.userSex" :label="3" value="3">保密</el-radio>
          </el-form-item>
          <el-form-item label="用户角色">
            <el-select v-model="selectedRoles" multiple placeholder="用户角色列表">
              <el-option
                v-for="item in roleInfo"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="负责设备库">
            <el-select v-model="detailForm.userRoom" class="filter-item" placeholder="请选择设备库...">
              <el-option v-for="(item,index) in roomInfo" :key="item" :label="item" :value="index+1" />
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="detailForm.userPhone" />
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="detailForm.userEmail" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="detailForm.createTime" readonly disabled />
          </el-form-item>
          <el-form-item label="登录时间">
            <el-input v-model="detailForm.loginTime" readonly disabled />
          </el-form-item>
          <el-form-item label="上一次登录">
            <el-input v-model="detailForm.lastLoginTime" readonly disabled />
          </el-form-item>
          <el-form-item label="登录次数">
            <el-input v-model="detailForm.loginCount" readonly disabled />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="detailForm.remark"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              placeholder="用户备注信息..."
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogModifyFormVisible = false">取 消</el-button>
          <el-button size="mini" @click="clearDetailForm">清 空</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="dialogModifyFormVisible = false;submitModifyForm()"
          >
            修 改
          </el-button>
        </div>
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
import { getUserList, getRoomInfo, getRoleInfo, fetchUserListByQuery } from '@/api/table'
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
  name: 'MemberTable',
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
        if (this.detailForm.checkLoginPwd !== '') {
          this.$refs.ruleForm.validateField('checkLoginPwd')
        }
        callback()
      }
    }
    const validateCheckLoginPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.detailForm.loginPwd) {
        callback(new Error('两次输入密码不一致!'))
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
      // 默认 详细信息、修改模态框 表单不可见（通过点击按钮方可显示）
      dialogDetailFormVisible: false,
      dialogModifyFormVisible: false,
      dialogAddFormVisible: false,
      // 当前页面所有用户的简略信息
      userTableData: null,
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
      // 详细的表单信息，用于填充详细信息表单 和 修改表单的默认信息 和 添加表单
      detailForm: {
        id: null,
        loginName: null,
        loginPwd: '',
        checkLoginPwd: '',
        realName: null,
        userSex: 3,
        userRole: null,
        userRoom: null,
        userPhone: null,
        userEmail: null,
        createTime: null,
        loginTime: null,
        lastLoginTime: null,
        loginCount: null,
        remark: null
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
      showRealName: false,
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
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        // loginPwd: [{ validator: validateLoginPwd, trigger: 'blur' }],
        loginPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,18}$/,
            message: '密码必须由字母、数字组成，区分大小写，长度为6-18位',
            trigger: 'blur'
          }
        ],
        checkLoginPwd: [{ validator: validateCheckLoginPwd, required: true, trigger: 'blur' }],
        // userRole: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
        userRoom: [{ required: true, message: '请选择用户负责设备库', trigger: 'change' }],
        // userPhone: [{ validator: checkUserPhone, required: true, trigger: 'blur' }],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/,
            message: '请输入正确的手机号码格式'
          }
        ],

        // userEmail: [{ validator: checkUserEmail, required: true, trigger: 'blur' }]
        userEmail: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: '请输入正确的电子邮箱格式'
          }
        ]
        /* type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]*/
      },
      downloadLoading: false
    }
  },
  created() {
    // 第一次进入用户列表页面，自动加载页面。
    this.getList()

    this.getUserList()
    this.getRoomInfo()
    this.getRoleInfo()
  },
  methods: {
    // getUserList()
    getUserList() {
      new Promise((resolve, reject) => {
        getUserList({ page: this.currentPage, limit: this.currentSize })
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

      const userEntities = resp.data.data
      const usersLength = userEntities.length
      let userSex = ''
      for (let i = 0; i < usersLength; i++) {
        // 设置用户性别
        userSex = userEntities[i].userSex
        userEntities[i].userSex = userSex === 1 ? '男' : (userSex === 2 ? '女' : '保密')
        // 设置用户角色列表
        const authorities = userEntities[i].authorities
        const authLength = authorities.length
        const roleList = []
        for (let j = 0; j < authLength; j++) {
          const roleName = authorities[j].authority
          roleList.push(roleName.substring(5))
        }
        userEntities[i].userRole = roleList.toString().replace(/,/g, ' | ')
      }
      // this.allUserTags = allUserTags
      this.userTableData = resp.data.data
      // let authorities = resp.data.data.authorities
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
      this.$nextTick(() => {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields()
        }
      })
      /* this.$refs[formName].resetFields();*/
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogAddFormVisible = true
      this.$nextTick(() => {
        this.$refs['userDataForm'].clearValidate()
      })
    },
    // 用于添加/修改用户的时候清空表单
    clearDetailForm() {
      this.detailForm.id = null
      this.detailForm.loginName = null
      this.detailForm.loginPwd = null
      this.detailForm.realName = null
      this.detailForm.userSex = null
      this.detailForm.userRole = null

      this.selectedRoles = null

      this.detailForm.userRoom = null
      this.detailForm.userPhone = null
      this.detailForm.userEmail = null
      this.detailForm.createTime = null
      this.detailForm.loginTime = null
      this.detailForm.lastLoginTime = null
      this.detailForm.loginCount = null
      this.detailForm.remark = null
    },

    // 处理点击添加按钮的请求
    handleAddUser() {
      // 添加用户之前先清空表单值 和 表单的验证提示信息
      // this.resetForm('userDataForm')
      this.clearDetailForm()
      this.$nextTick(() => {
        this.$refs['userDataForm'].clearValidate()
      })
      // this.resetForm('detailForm')
      // this.dialogAddFormVisible = true
      /* this.resetTemp()
      this.dialogStatus = 'create'*/
      /* this.$nextTick(() => {
        this.$refs['userDataForm'].clearValidate()
      })*/
    },
    // 处理提交添加表单请求
    submitAddForm(userDataForm) {
      this.$refs[userDataForm].validate((valid) => {
        if (valid) {
          // 表单校验通过
          this.detailForm.loginCount = 1
          this.detailForm.createTime = new Date().getTime()
          new Promise((resolve, reject) => {
            this.detailForm.remark += '_' + this.selectedRoles.toString()
            addUser(this.detailForm)
              .then(resp => {
                const isSuccess = resp.data === true
                this.dialogAddFormVisible = false
                isSuccess
                  ? this.$message({
                    showClose: true,
                    message: '用户【' + this.detailForm.loginName + '】添加成功。',
                    type: 'success'
                  })
                  : this.$message({
                    // 失败，给出提示信息
                    showClose: true,
                    message: '用户【' + this.detailForm.loginName + '】添加失败，请检查后重新提交。',
                    type: 'warning'
                  })
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

    // 处理展示用户详情信息请求
    handleShowUser(row) {
      this.selectedRoles = []
      const roleStr = row.userRole
      const roleList = roleStr.split(' | ')
      // 用户角色列表的展示
      for (let i = 0; i < roleList.length; i++) {
        const roleName = roleList[i]
        this.selectedRoles.push(roleName)
      }
      this.detailForm = row
    },

    // 处理点击修改按钮
    handleModifyUser(row, index) {
      // index：当前表格页面的index值。
      // 用户点击修改按钮，发送异步请求到后端，后端处理请求并且返回给前端进行展示。
      this.selectedRoles = []
      new Promise((resolve, reject) => {
        getUserById(row.id)
          .then((resp) => {
            const userEntity = resp.data
            const authorities = userEntity.authorities
            const authLength = authorities.length
            const authList = []
            for (let i = 0; i < authLength; i++) {
              const authority = authorities[i].authority
              authList.push(authority.substring(5))
              // 点击编辑用户按钮后，将从数据库查询的 角色列表 填充到selectedRoles供默认选中
              this.selectedRoles.push(authority.substring(5))
            }
            userEntity.userRole = authList.toString().replace(/,/g, ' | ')
            this.detailForm = userEntity
            resolve(resp)
          }, (err) => {
            reject(err)
          })
      })
    },
    // 处理提交修改表单
    submitModifyForm() {
      // let form = JSON.stringify(this.detailForm)
      // form默认的提交方式content-type是x-www-form-urlencoded, 后端接收为@RequestBody,需要content-type是application/json
      new Promise((resolve, reject) => {
        /* this.detailForm.authorities = 'VISITOR | ADMIN'*/
        this.detailForm.remark += '_' + this.selectedRoles.toString()
        modifyUser(this.detailForm)
          .then(resp => {
            const isSuccess = resp.data === true
            isSuccess
              ? this.$message({
                showClose: true,
                message: '用户【' + this.detailForm.id + '】修改成功。',
                type: 'success'
              })
              : this.$message({
                // 失败，给出提示信息
                showClose: true,
                message: '用户【' + this.detailForm.id + '】修改失败，请检查后重新提交。',
                type: 'warning'
              })
            this.getUserList()
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 处理删除请求
    /* handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },*/
    handleDeleteUser(row, index) {
      this.$confirm('此操作将永久删除【' + row.loginName + '】, 是否继续?', '删除用户', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删 除',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(() => {
          new Promise((resolve, reject) => {
            deleteUser(row.id)
              .then(resp => {
                this.getUserList()
                resolve(resp)
              })
              .catch(err => {
                reject(err)
              })
          })
          this.$notify({
            title: 'Success',
            dangerouslyUseHTMLString: true,
            message: '<strong>删除用户 <i>' + row.loginName + '</i> 成功</strong>',
            type: 'success',
            duration: 3000
          })
          // this.userTableData.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            showClose: true,
            message: '取消删除'
          })
        })
    },

    // 处理当前页码的改变，去到页码为：`currentPage`的那一页。
    handleCurrentPageChange(currentPage) {
      this.$store.state.currentPage = currentPage
      const size = this.$store.state.currentSize

      const query = {
        page: currentPage,
        limit: size,
        realName: this.listQuery.userKeyWord,
        userRole: this.listQuery.userRole,
        userRoom: this.listQuery.userRoom
      }

      new Promise((resolve, reject) => {
        fetchUserListByQuery(query)
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

      const query = {
        page: this.currentPage,
        limit: `${val}`,
        realName: this.listQuery.userKeyWord,
        userRole: this.listQuery.userRole,
        userRoom: this.listQuery.userRoom
      }

      new Promise((resolve, reject) => {
        fetchUserListByQuery(query)
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
