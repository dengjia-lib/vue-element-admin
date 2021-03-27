<template>
  <div class="app-container">
    <aside style="margin-top:15px;">
      Here we use window.print() to implement the feature of downloading PDF.
      （在这里，我们使用window.print（）实现下载PDF的功能。）
    </aside>
    <router-link target="_blank" to="/pdf/download">
      <el-button type="primary">
        点击下载PDF
      </el-button>
    </router-link>
  </div>
</template>

