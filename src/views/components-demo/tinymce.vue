<template>
  <div class="components-container">
    <aside>
      Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In
      the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been
      basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.
      （富文本是管理后端的核心功能，但与此同时，它又是一个坑坑洼洼的地方。在选择丰富文本的过程中，我也走了很多弯路。市场上常见的富文本已基本使用，我最终选择了Tinymce。请参阅更详细的富文本比较和介绍。）
      <a
        target="_blank"
        class="link-type"
        href="https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html"
      >Documentation</a>
    </aside>
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content:
      // "//www.tinymce.com/images/glyph-tinymce@2x.png"
        `<h1 style="text-align: center;">欢迎来到TinyMCE演示！</h1><p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="data:image/png;base64,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" alt="TinyMCE Logo" width="110"/><ul>
          <li>
            我们的 <a href="//www.tinymce.com/docs/">documentation</a> 是学习如何配置TinyMCE的重要资源。
          </li>
          <li>
            有一个具体问题吗？参见 <a href="https://community.tinymce.com/forum/">社区论坛</a>.
          </li>
          <li>
            我们还提供企业级支持，作为 <a href="https://tinymce.com/pricing">TinyMCE高级订阅</a>.
          </li>
      </ul>`
    }
  }
}
</script>

<style scoped>
.editor-content {
  margin-top: 20px;
}
</style>

