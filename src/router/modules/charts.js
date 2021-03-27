/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '图表',
    icon: 'chart'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard'),
      name: 'KeyboardChart',
      meta: { title: 'Keyboard Chart', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: 'Line Chart', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart'),
      name: 'MixChart',
      meta: { title: 'Mix Chart', noCache: true }
    },
    {
      path: 'pie-chart',
      component: () => import('@/views/charts/pie-chart'),
      name: 'PieChart',
      meta: { title: '饼形图', noCache: true, affix: true }
    },
    {
      path: 'board-chart',
      component: () => import('@/views/charts/board-chart'),
      name: 'BoardChart',
      meta: { title: '仪表图', noCache: true, affix: true }
    }
  ]
}

export default chartsRouter
