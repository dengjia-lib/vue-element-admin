/** 当您的路由表太长时，您可以将其拆分为小模块 **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/equ-table',
  name: 'Table',
  meta: {
    title: '信息列表',
    icon: 'table'
  },
  children: [
    {
      path: 'member-table',
      component: () => import('@/views/table/member-table'),
      name: 'MemberTable',
      meta: {
        title: '用户列表',
        affix: true
      }
    },
    {
      path: 'equ-table',
      component: () => import('@/views/table/equ-table'),
      name: 'EquTable',
      meta: {
        title: '设备列表',
        affix: true
      }
    },
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: {
        title: 'Dynamic Table',
        roles: ['ADMIN', 'SUPERADMIN']
      }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: {
        title: 'Drag Table',
        roles: ['ADMIN', 'SUPERADMIN']
      }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: {
        title: 'Inline Edit',
        roles: ['ADMIN', 'SUPERADMIN']
      }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: {
        title: 'Complex Table',
        roles: ['ADMIN', 'SUPERADMIN']
      }
    }
  ]
}
export default tableRouter
