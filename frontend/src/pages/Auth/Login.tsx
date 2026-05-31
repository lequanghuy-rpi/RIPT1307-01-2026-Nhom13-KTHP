import React from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from '@umijs/max';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      const apiUrl = `http://${window.location.hostname}:5000/api/auth/login`;
      const response = await axios.post(apiUrl, values);
      const { token, user } = response.data.data; // Lấy từ response.data.data

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công!');

      window.location.href = '/';
    } catch (error) {
      message.error('Đăng nhập thất bại, vui lòng kiểm tra lại!');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', display: 'flex', alignItems: 'center' }}>
      <LoginForm
        title="Esports Platform"
        subTitle="Đăng nhập để quản lý giải đấu"
        onFinish={handleSubmit}
      >
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: '✉️',
          }}
          placeholder="Email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: '🔒',
          }}
          placeholder="Mật khẩu"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!',
            },
          ]}
        />
        <div style={{ marginBlockEnd: 24, textAlign: 'center' }}>
          <a onClick={() => navigate('/register')}>Chưa có tài khoản? Đăng ký ngay</a>
        </div>
      </LoginForm>
    </div>
  );
};

export default Login;
