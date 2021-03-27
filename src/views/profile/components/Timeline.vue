<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2021/01/02',
          title: '登录',
          content: '完成用户登录功能'
        },
        {
          timestamp: '2021/01/08',
          title: '用户列表',
          content: '完成用户信息的CRUD'
        },
        {
          timestamp: '2021/01/12',
          title: '设备列表',
          content: '完成设备信息的CRUD'
        },
        {
          timestamp: '2021/01/30',
          title: '其他',
          content: '继续完成系统其他功能的开发'
        }
      ]
    }
  }
}
</script>
