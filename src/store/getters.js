const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  id: state => state.user.id,
  avatar: state => state.user.avatar,
  loginName: state => state.user.loginName,
  realName: state => state.user.realName,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  email: state => state.user.email,
  room: state => state.user.room,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  myvalue: state => state.myvalue
}
export default getters
