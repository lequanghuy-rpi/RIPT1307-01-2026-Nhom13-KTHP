import React from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useNavigate } from '@umijs/max';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      const apiUrl = `http://${window.location.hostname}:5000/api/auth/register`;
      await axios.post(apiUrl, values);
      message.success('Đăng ký thành công, vui lòng đăng nhập!');
      navigate('/login');
    } catch (error) {
      message.error('Đăng ký thất bại, email có thể đã tồn tại!');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh', display: 'flex', alignItems: 'center' }}>
      <LoginForm
        title="Đăng Ký Tài Khoản"
        subTitle="Tham gia hệ thống quản lý giải đấu"
        onFinish={handleSubmit}
        submitter={{ searchConfig: { submitText: 'Đăng ký' } }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: '👤',
          }}
          placeholder="Tên đăng nhập (Username)"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        />
        <ProFormText
          name="email"
          fieldProps={{
            size: 'large',
            prefix: '✉️',
          }}
          placeholder="Email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: '🔒',
          }}
          placeholder="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        />
        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: '🔒',
          }}
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
        <div style={{ marginBlockEnd: 24, textAlign: 'center' }}>
          <a onClick={() => navigate('/login')}>Đã có tài khoản? Đăng nhập ngay</a>
        </div>
      </LoginForm>
    </div>
  );
};

export default Register;
