export default [
  { path: '/', component: 'index', name: 'Trang chủ', icon: 'AppstoreOutlined' },
  { path: '/tournaments', component: 'tournaments/index', name: 'Giải đấu', icon: 'TrophyOutlined' },
  { path: '/tournaments/:id', component: 'tournaments/[id]', name: 'Chi tiết giải đấu', hideInMenu: true },
  { path: '/schedule', component: 'schedule/index', name: 'Lịch thi đấu', icon: 'CalendarOutlined' },
  { path: '/teams', component: 'teams/index', name: 'Đội tham gia', icon: 'TeamOutlined' },
  {
    path: '/my-registrations',
    name: 'Giải đã đăng ký',
    component: './my-registrations',
    access: 'normalUser',
    icon: 'ScheduleOutlined'
  },
  {
    path: '/manage-registrations',
    name: 'Đội chơi đăng ký',
    component: 'Admin/registrations/index',
    access: 'canAdmin',
    icon: 'ScheduleOutlined'
  },
  { path: '/leaderboard', component: 'leaderboard/index', name: 'Bảng xếp hạng', icon: 'BarChartOutlined' },
  { path: '/settings', component: 'settings/index', name: 'Cài đặt', icon: 'SettingOutlined' },
  { path: '/login', component: 'Auth/index', layout: false },
  { path: '/register', component: 'Auth/index', layout: false },
  
  {
    path: '/notifications',
    name: 'Thông báo',
    component: './notifications',
    hideInMenu: true,
  },

  {
    path: '/admin',
    name: 'Admin',
    access: 'canAdmin',
    hideInMenu: true,
    routes: [
      { path: '/admin', redirect: '/admin/tournaments' },
      { path: '/admin/tournaments', component: 'Admin/tournaments/index', name: 'Quản lý giải đấu' },
      { path: '/admin/registrations', component: 'Admin/registrations/index', name: 'Quản lý đăng ký' },
      { path: '/admin/statistics', component: 'Admin/statistics/index', name: 'Thống kê' },
    ],
  },
];