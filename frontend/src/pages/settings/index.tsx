import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography, Row, Col, Avatar, Button, Form, Input, Divider, message, Popconfirm, Spin, Skeleton, Statistic } from 'antd';
import { UserOutlined, CameraOutlined, DeleteOutlined, LockOutlined, MailOutlined, IdcardOutlined, TrophyOutlined, FireOutlined, GlobalOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useModel } from '@umijs/max';
import axios from 'axios';
import './settings.css';

const { Title, Text } = Typography;

const API_BASE = process.env.UMI_APP_API_URL ? process.env.UMI_APP_API_URL.replace('/api', '') : `http://${window.location.hostname}:5000`;

/** Cập nhật trường avatar trong localStorage.user để getInitialState đọc đúng sau F5 */
const syncLocalUser = (avatar: string | null) => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const user = JSON.parse(raw);
    if (avatar === null) {
      delete user.avatar;
    } else {
      user.avatar = avatar;
    }
    localStorage.setItem('user', JSON.stringify(user));
  } catch {}
};

const SettingsPage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(initialState?.avatar);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [stats, setStats] = useState<{ tournamentsJoined: number; totalKills: number; totalTop1: number } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.data;
        setUserInfo({ username: user.username, email: user.email });

        // Lấy thống kê
        const statsRes = await axios.get(`${API_BASE}/api/auth/me/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      } finally {
        setUserInfoLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleChangePassword = async (values: any) => {
    setPwLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE}/api/auth/me/password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Đổi mật khẩu thành công!');
      form.resetFields();
    } catch (err: any) {
      // Hiển thị thông báo lỗi chính xác từ backend (ví dụ: "mật khẩu hiện tại không đúng")
      const msg = err?.response?.data?.message || 'Mật khẩu không đổi được, vui lòng thử lại!';
      message.error(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Tài khoản đã được xóa vĩnh viễn.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Không thể xóa tài khoản, vui lòng thử lại!';
      message.error(msg);
    }
  };

  const handleAvatarClick = () => {
    if (!uploadLoading) fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error('Ảnh không được vượt quá 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadLoading(true);
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${API_BASE}/api/auth/me/avatar`,
          { avatar: base64 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvatarSrc(base64);
        syncLocalUser(base64); // giữ ảnh sau F5
        message.success('Ảnh đại diện đã được lưu vào hệ thống!');
      } catch {
        message.error('Không thể lưu ảnh, vui lòng thử lại!');
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleRemoveAvatar = async () => {
    setUploadLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/auth/me/avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvatarSrc(undefined);
      syncLocalUser(null);
      message.info('Đã xóa ảnh đại diện.');
    } catch {
      message.error('Không thể xóa ảnh, vui lòng thử lại!');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <PageContainer title="Cài Đặt Tài Khoản">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Profile & Account */}
          <Col xs={24} md={10} lg={8}>
            <Card title="Hồ sơ của bạn" className="settings-card" bordered={false}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div className="avatar-container">
                <div
                  className="avatar-wrapper avatar-clickable"
                  onClick={handleAvatarClick}
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                  title="Nhấn để thay đổi ảnh đại diện"
                >
                  <Avatar
                    size={120}
                    icon={<UserOutlined />}
                    src={avatarSrc}
                  />
                  <div className={`avatar-overlay ${isHoveringAvatar ? 'avatar-overlay--visible' : ''}`}>
                    <CameraOutlined style={{ fontSize: 28, color: '#fff' }} />
                    <span style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>Thay đổi</span>
                  </div>
                </div>
                <Title level={4} style={{ margin: 0 }}>
                  {userInfo?.username || initialState?.name || 'Người dùng'}
                </Title>
                <Text type="secondary" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
                  Vai trò: {initialState?.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                </Text>

                {/* Thông tin tài khoản */}
                <div className="user-info-block">
                  {userInfoLoading ? (
                    <Skeleton active paragraph={{ rows: 2 }} title={false} style={{ width: 200 }} />
                  ) : (
                    <>
                      <div className="user-info-row">
                        <IdcardOutlined className="user-info-icon" />
                        <div className="user-info-detail">
                          <span className="user-info-label">Tên tài khoản</span>
                          <span className="user-info-value">{userInfo?.username || '—'}</span>
                        </div>
                      </div>
                      <div className="user-info-row">
                        <MailOutlined className="user-info-icon" />
                        <div className="user-info-detail">
                          <span className="user-info-label">Email đăng ký</span>
                          <span className="user-info-value">{userInfo?.email || '—'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Spin spinning={uploadLoading}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      onClick={handleAvatarClick}
                      disabled={uploadLoading}
                    >
                      Thay đổi ảnh
                    </Button>
                    {avatarSrc && (
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveAvatar}
                        disabled={uploadLoading}
                        style={{
                          background: 'transparent',
                          borderColor: 'rgba(255,255,255,0.25)',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        Xóa ảnh
                      </Button>
                    )}
                  </div>
                </Spin>
              </div>

              {initialState?.role !== 'ADMIN' && (
                <>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  <div style={{ marginTop: 16 }}>
                    <Title level={5} style={{ color: '#ff4d4f' }}>Khu vực nguy hiểm</Title>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 16 }}>
                      Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và không thể khôi phục.
                    </Text>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa tài khoản?"
                      description="Mọi dữ liệu của bạn sẽ bị xóa vĩnh viễn."
                      onConfirm={handleDeleteAccount}
                      okText="Xóa vĩnh viễn"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger className="btn-danger" icon={<DeleteOutlined />} block>
                        Tự xóa tài khoản
                      </Button>
                    </Popconfirm>
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* Right Column: Preferences & Security */}
          <Col xs={24} md={14} lg={16}>
            <Row gutter={[24, 24]}>
              {initialState?.role !== 'ADMIN' && (
                <Col span={24}>
                  <Card title="Thành tích thi đấu" className="settings-card" bordered={false}>
                    {userInfoLoading ? (
                      <Skeleton active />
                    ) : (
                      <Row gutter={[16, 16]}>
                        <Col xs={12} sm={8}>
                          <Card bordered={false} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Statistic
                              title={<span style={{ color: 'rgba(255,255,255,0.6)' }}>Giải tham gia</span>}
                              value={stats?.tournamentsJoined || 0}
                              prefix={<GlobalOutlined style={{ color: '#1890ff' }} />}
                              valueStyle={{ color: '#fff' }}
                            />
                          </Card>
                        </Col>
                        <Col xs={12} sm={8}>
                          <Card bordered={false} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Statistic
                              title={<span style={{ color: 'rgba(255,255,255,0.6)' }}>Tổng Kills</span>}
                              value={stats?.totalKills || 0}
                              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
                              valueStyle={{ color: '#fff' }}
                            />
                          </Card>
                        </Col>
                        <Col xs={12} sm={8}>
                          <Card bordered={false} style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <Statistic
                              title={<span style={{ color: 'rgba(255,255,255,0.6)' }}>Vô địch (Top 1)</span>}
                              value={stats?.totalTop1 || 0}
                              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                              valueStyle={{ color: '#fff' }}
                            />
                          </Card>
                        </Col>
                      </Row>
                    )}
                  </Card>
                </Col>
              )}
              <Col span={24}>
                <Card title="Bảo mật" className="settings-card" bordered={false}>
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                    style={{ maxWidth: 400 }}
                  >
                    <Form.Item
                      label="Mật khẩu hiện tại"
                      name="currentPassword"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} placeholder="Nhập mật khẩu hiện tại" />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }, { min: 6, message: 'Mật khẩu phải từ 6 ký tự' }]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} placeholder="Nhập mật khẩu mới" />
                    </Form.Item>

                    <Form.Item
                      label="Xác nhận mật khẩu mới"
                      name="confirmPassword"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={pwLoading}
                        icon={<LockOutlined />}
                      >
                        Lưu mật khẩu mới
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>
      </motion.div>
    </PageContainer>
  );
};

export default SettingsPage;
