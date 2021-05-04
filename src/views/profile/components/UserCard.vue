<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>个人资料</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="this.$store.getters.avatar" :height="'100px'" :width="'100px'" :hoverable="false" />
      </div>
      <div class="box-center">
        <div class="user-change-avatar text-center">
          <el-button type="text" @click="imagecropperShow=true">更改头像</el-button>
        </div>
        <div class="user-name text-center">{{ user.loginName }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="http://localhost:8080/user/upload/avatar"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" />
          <span>教育背景</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            成都大学计算机科学与技术专业
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="skill" />
          <span>技能专长</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="40" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="28" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="15" />
          </div>
          <div class="progress-item">
            <span>Java</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

export default {
  components: { ImageCropper, PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          loginName: '',
          email: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  methods: {
    cropSuccess(resData) {
      // this.user.avatar = resData
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      // this.image = resData.files.avatar
      this.$store.dispatch('user/uploadAvatar', resData)
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .user-change-avatar {

  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
