<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="活动" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="时间线" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="账户" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="changePwd">
                <change-pwd :pwd="pwd" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'
import ChangePwd from './components/ChangePwd'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account, ChangePwd },
  data() {
    return {
      user: {},
      pwd: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'avatar',
      'loginName',
      'realName',
      'introduction',
      'roles',
      'email'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        id: this.id,
        avatar: this.avatar,
        loginName: this.loginName,
        realName: this.realName,
        introduction: this.introduction,
        role: this.roles.join(' | '),
        email: this.email
      }
    },
    getPwd() {
      this.pwd = {
        oldPwd: this.loginPwd
      }
    }
  }
}
</script>
