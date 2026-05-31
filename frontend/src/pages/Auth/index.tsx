import React, { useState, useEffect } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate, useLocation } from '@umijs/max';
import axios from 'axios';
import './Auth.css';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Initialize state based on current URL so direct visits don't animate unnecessarily
  const [isRightPanelActive, setIsRightPanelActive] = useState(location.pathname === '/register');

  // Navigate silently to prevent Umi from remounting the component and breaking the CSS transition
  const handleGoToRegister = () => {
    setIsRightPanelActive(true);
    window.history.pushState({}, '', '/register');
  };
  
  const handleGoToLogin = () => {
    setIsRightPanelActive(false);
    window.history.pushState({}, '', '/login');
  };

  const handleLoginSubmit = async (values: any) => {
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
    }
  };

  const handleRegisterSubmit = async (values: any) => {
    try {
      const apiUrl = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/auth/register` : `http://${window.location.hostname}:5000/api/auth/register`;
      await axios.post(apiUrl, values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      navigate('/login');
    } catch (error) {
      message.error('Đăng ký thất bại, email có thể đã tồn tại!');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        
        {/* Sign Up Panel */}
        <div className="form-container sign-up-container">
          <LoginForm
            title="Tạo Tài Khoản"
            subTitle="Đăng ký để tham gia giải đấu"
            onFinish={handleRegisterSubmit}
            submitter={{ searchConfig: { submitText: 'Đăng Ký' } }}
          >
            <ProFormText
              name="username"
              fieldProps={{ size: 'large', prefix: '👤' }}
              placeholder="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            />
            <ProFormText
              name="email"
              fieldProps={{ size: 'large', prefix: '✉️' }}
              placeholder="Email"
              rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: '🔒' }}
              placeholder="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            />
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{ size: 'large', prefix: '🔒' }}
              placeholder="Xác nhận mật khẩu"
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
            />
          </LoginForm>
        </div>

        {/* Sign In Panel */}
        <div className="form-container sign-in-container">
          <LoginForm
            title="Đăng Nhập"
            subTitle="Esport Hub - Quản lý giải đấu"
            onFinish={handleLoginSubmit}
          >
            <ProFormText
              name="email"
              fieldProps={{ size: 'large', prefix: '✉️' }}
              placeholder="Email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: 'large', prefix: '🔒' }}
              placeholder="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            />
          </LoginForm>
        </div>

        {/* Sliding Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            
            <div className="overlay-panel overlay-left">
              <h1>Chào mừng trở lại!</h1>
              <p>Để duy trì kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
              <button className="overlay-btn" id="signIn" onClick={handleGoToLogin}>Đăng Nhập</button>
            </div>
            
            <div className="overlay-panel overlay-right">
              <h1>Chào bạn mới!</h1>
              <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình Esport cùng chúng tôi</p>
              <button className="overlay-btn" id="signUp" onClick={handleGoToRegister}>Đăng Ký</button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
