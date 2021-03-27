module.exports = {
  title: 'EMS',

  /**
   * @type {boolean} true | false
   * @description 是否在右面板显示 设置
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否需要 tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description 是否固定标签
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在边栏中显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 需要显示错误日志的组件。
   * 默认仅在生产环境中使用
   * 如果您还想在开发环境中使用它，则可以设置['production','development']
   */
  errorLog: 'production'
  // errorLog: ['production', 'development']
}
