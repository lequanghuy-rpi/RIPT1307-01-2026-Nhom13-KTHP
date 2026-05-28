import { Dropdown, ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { LogoutOutlined, LoginOutlined, FacebookOutlined, InstagramOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import { history, RequestConfig } from '@umijs/max';
import logoImg from './public/logo.png';
import './global-bg.css';

export function rootContainer(container: any) {
  return (
    <ConfigProvider locale={viVN}>
      {container}
    </ConfigProvider>
  );
}

export const request: RequestConfig = {
  baseURL: process.env.UMI_APP_API_URL ? process.env.UMI_APP_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`,
  timeout: 10000,
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('token');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, options };
    },
  ],
};

import NotificationBell from '@/components/NotificationBell';

export async function getInitialState(): Promise<{
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}> {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const apiUrl = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/auth/me` : `http://${window.location.hostname}:5000/api/auth/me`;
      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const user = json.data;
        // Đồng bộ avatar vào localStorage để dùng offline
        const cached = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...cached, ...user }));
        return {
          id: user.id || cached.id || '',
          name: user.username || user.email || 'User',
          username: user.username || '',
          email: user.email || '',
          role: user.role || 'USER',
          avatar: user.avatar ?? undefined,
        };
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback về localStorage nếu mất mạng
    const cached = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      id: cached.id || '',
      name: cached.username || cached.email || 'User',
      username: cached.username || '',
      email: cached.email || '',
      role: cached.role || 'USER',
      avatar: cached.avatar ?? undefined,
    };
  }

  return { id: '', name: '', username: '', email: '', role: '' };
}


export const layout = ({
  initialState,
}: {
  initialState: any;
}) => {
  return {
    onPageChange: () => {
      const token = localStorage.getItem('token');
      const location = window.location;

      const publicRoutes = ['/login', '/register', '/'];

      if (!token && !publicRoutes.includes(location.pathname)) {
        window.location.href = '/login';
      }
    },
    logo: logoImg,

    title: 'Esport Hub',

    menu: {
      locale: false,
    },

    layout: 'top',
    navTheme: 'realDark',
    contentWidth: 'Fluid',
    fixedHeader: true,
    actionsRender: false, // Ẩn các icon mặc định (kính lúp, chuông) của Umi


    token: {
      bgLayout: 'transparent', // Make layout transparent to see global background
      header: {
        colorBgHeader: 'rgba(21, 19, 34, 0.7)', // Glassmorphism header
        colorTextMenu: 'rgba(255, 255, 255, 0.85)',
        colorTextMenuSelected: '#fff',
        colorBgMenuItemSelected: '#2F2356', // Purple selection
      },
    },

    avatarProps: {
      title: initialState?.role === 'ADMIN' ? 'Admin' : (initialState?.username || initialState?.name || 'User'),
      render: (_: any, avatarChildren: any) => {
        const isLoggedIn = !!initialState?.name;

        const menuItems = isLoggedIn
          ? [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Đăng xuất',
            },
          ]
          : [
            {
              key: 'login',
              icon: <LoginOutlined />,
              label: 'Đăng nhập',
            },
          ];

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isLoggedIn && <NotificationBell />}
            <Dropdown
              menu={{
                items: menuItems,
                onClick: ({ key }) => {
                  if (key === 'logout') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
                  } else if (key === 'login') {
                    window.location.href = '/login';
                  }
                },
              }}
            >
              {avatarChildren}
            </Dropdown>
          </div>
        );
      },
    },



    footerRender: () => (
      <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255, 255, 255, 0.65)' }}>
        <div style={{ marginBottom: 8 }}>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><FacebookOutlined /></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><InstagramOutlined /></a>
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', margin: '0 8px', fontSize: '20px' }}><GithubOutlined /></a>
        </div>
        <div>
          <MailOutlined style={{ marginRight: 8 }} />
          <span>Liên hệ: huynew@gmail.com</span>
        </div>
      </div>
    ),
  };
};