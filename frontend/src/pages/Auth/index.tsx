import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from '@umijs/max';
import axios from 'axios';
import './Auth.css';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRightPanelActive, setIsRightPanelActive] = useState(location.pathname === '/register');
  const [loading, setLoading] = useState(false);

  const handleGoToRegister = () => {
    setIsRightPanelActive(true);
    window.history.pushState({}, '', '/register');
  };
  
  const handleGoToLogin = () => {
    setIsRightPanelActive(false);
    window.history.pushState({}, '', '/login');
  };

  const handleLoginSubmit = async (values: any) => {
    setLoading(true);
    try {
      const apiUrl = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/auth/login` : `http://${window.location.hostname}:5000/api/auth/login`;
      const response = await axios.post(apiUrl, values);
      const { token, user } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công!');

      window.location.href = '/';
    } catch (error) {
      message.error('Đăng nhập thất bại, vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (values: any) => {
    setLoading(true);
    try {
      const apiUrl = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/auth/register` : `http://${window.location.hostname}:5000/api/auth/register`;
      await axios.post(apiUrl, values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      handleGoToLogin();
    } catch (error) {
      message.error('Đăng ký thất bại, email có thể đã tồn tại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="cyber-grid"></div>
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        
        {/* Sign Up Panel */}
        <div className="form-container sign-up-container">
          <Form
            className="cyber-form"
            name="register"
            onFinish={handleRegisterSubmit}
            layout="vertical"
          >
            <div className="form-header stagger-1">
              <div className="badge"><ThunderboltFilled /> TOURNAMENT MANAGEMENT PLATFORM</div>
              <h1 className="cyber-title">Tạo Tài Khoản</h1>
              <p className="cyber-subtitle">Gia nhập đấu trường Esport ngay hôm nay</p>
            </div>

            <div className="floating-label-item stagger-2">
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                style={{ margin: 0 }}
              >
                <Input size="large" prefix={<UserOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Tên đăng nhập</label>
            </div>
            <div className="floating-label-item stagger-3">
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                style={{ margin: 0 }}
              >
                <Input size="large" prefix={<MailOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Email</label>
            </div>
            <div className="floating-label-item stagger-4">
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                style={{ margin: 0 }}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Mật khẩu</label>
            </div>
            <div className="floating-label-item stagger-5">
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
                style={{ margin: 0 }}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Xác nhận mật khẩu</label>
            </div>

            <Form.Item className="stagger-6">
              <Button type="primary" htmlType="submit" className="cyber-btn" loading={loading} block size="large">
                <span className="btn-text">Đăng Ký</span>
                <div className="btn-shimmer"></div>
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Sign In Panel */}
        <div className="form-container sign-in-container">
          <Form
            className="cyber-form"
            name="login"
            onFinish={handleLoginSubmit}
            layout="vertical"
          >
            <div className="form-header stagger-1">
              <div className="badge"><ThunderboltFilled /> TOURNAMENT MANAGEMENT PLATFORM</div>
              <h1 className="cyber-title">Đăng Nhập</h1>
              <p className="cyber-subtitle">Esport Hub - Quản lý giải đấu</p>
            </div>

            <div className="floating-label-item stagger-2">
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                style={{ margin: 0 }}
              >
                <Input size="large" prefix={<MailOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Email</label>
            </div>
            <div className="floating-label-item stagger-3">
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                style={{ margin: 0 }}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder=" " />
              </Form.Item>
              <label className="floating-label">Mật khẩu</label>
            </div>

            <Form.Item className="stagger-4" style={{ marginTop: '24px' }}>
              <Button type="primary" htmlType="submit" className="cyber-btn" loading={loading} block size="large">
                <span className="btn-text">Đăng Nhập</span>
                <div className="btn-shimmer"></div>
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Sliding Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            
            <div className="overlay-panel overlay-left">
              <div className="overlay-content">
                <div className="cyber-graphic">
                  <div className="hexagon"></div>
                  <div className="hexagon hex-2"></div>
                </div>
                <h1 className="cyber-title">Chào mừng trở lại!</h1>
                <p>Để duy trì kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
                <div className="dynamic-stats">
                  <div className="stat-item"><span>12,000+</span> Players</div>
                  <div className="stat-divider">·</div>
                  <div className="stat-item"><span>340</span> Tournaments</div>
                  <div className="stat-divider">·</div>
                  <div className="stat-item"><span>89</span> Countries</div>
                </div>
                <button className="overlay-btn ghost" onClick={handleGoToLogin}>
                  Đăng Nhập
                  <div className="btn-shimmer"></div>
                </button>
              </div>
            </div>
            
            <div className="overlay-panel overlay-right">
              <div className="overlay-content">
                <div className="cyber-graphic">
                  <div className="hexagon"></div>
                  <div className="hexagon hex-2"></div>
                </div>
                <h1 className="cyber-title">Chào bạn mới!</h1>
                <p>Nếu là lần đầu bạn tới với chúng tôi hãy đăng ký thông tin cá nhân của bạn và bắt đầu hành trình Esport cùng chúng tôi</p>
                <div className="dynamic-stats">
                  <div className="stat-item"><span>12,000+</span> Players</div>
                  <div className="stat-divider">·</div>
                  <div className="stat-item"><span>340</span> Tournaments</div>
                  <div className="stat-divider">·</div>
                  <div className="stat-item"><span>89</span> Countries</div>
                </div>
                <button className="overlay-btn ghost" onClick={handleGoToRegister}>
                  Đăng Ký
                  <div className="btn-shimmer"></div>
                </button>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
