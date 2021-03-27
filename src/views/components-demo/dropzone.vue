<template>
  <div class="components-container">
    <aside>
      基于 <a class="link-type" href="https://github.com/rowanwins/vue-dropzone"> dropzone </a>.
      Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.
      （因为我的业务有特殊需要，并且必须将图像上传到qiniu，所以我选择由我自己封装而不是第三方。这很简单，您可以在@componentsDropzone中查看详细代码。）
    </aside>
    <div class="editor-container">
      <dropzone id="myVueDropzone" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
    </div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'DropzoneDemo',
  components: { Dropzone },
  methods: {
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    }
  }
}
</script>

