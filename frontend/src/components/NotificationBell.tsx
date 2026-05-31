import { useState, useEffect } from 'react';
import { Badge, Popover, List, Button, Modal, Typography, Space } from 'antd';
import { BellOutlined, NotificationOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { getMyNotifications, getUnreadCount, markAsRead } from '@/services/notification';
import { motion, AnimatePresence } from 'framer-motion';

const { Text } = Typography;

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Router history
  const navigate = useNavigate();

  // Quản lý Modal hiển thị thông báo chi tiết
  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  const fetchNotifications = async (isAll = showAll) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [unreadRes, listRes] = await Promise.all([
        getUnreadCount(),
        getMyNotifications({ page: 1, limit: isAll ? 50 : 5 }) // fetch more if showAll is true
      ]);

      if (unreadRes.success) setUnreadCount(unreadRes.data.count);
      if (listRes.success) setNotifications(listRes.data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Optional: Auto refresh every 30 seconds
    const interval = setInterval(() => fetchNotifications(showAll), 30000);
    return () => clearInterval(interval);
  }, [showAll]);

  const handleNotificationClick = async (item: any) => {
    if (!item.isRead) {
      try {
        await markAsRead(item.id);
        fetchNotifications();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
    setOpen(false);
    setSelectedNotif(item);
  };

  // Nội dung popup thông báo
  const content = (
    <div style={{ width: 340, maxHeight: 450, overflowY: 'auto', padding: '0 8px' }}>
      <List
        dataSource={notifications}
        locale={{ emptyText: <span style={{ color: 'rgba(255,255,255,0.45)' }}>Không có thông báo nào</span> }}
        renderItem={(item, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <List.Item
              style={{ 
                cursor: 'pointer',
                backgroundColor: item.isRead ? 'transparent' : 'rgba(24, 144, 255, 0.15)',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: item.isRead ? 0 : 8,
                marginBottom: 4,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.isRead ? 'transparent' : 'rgba(24, 144, 255, 0.15)'}
              onClick={() => handleNotificationClick(item)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ 
                    width: 36, height: 36, borderRadius: '50%', 
                    background: item.isRead ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #1890ff, #722ed1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: item.isRead ? 'none' : '0 0 10px rgba(24,144,255,0.5)'
                  }}>
                    {item.title.toLowerCase().includes('đăng ký') ? 
                      <CheckCircleOutlined style={{ color: '#fff', fontSize: 16 }} /> : 
                      <NotificationOutlined style={{ color: '#fff', fontSize: 16 }} />
                    }
                  </div>
                }
                title={<span style={{ fontWeight: item.isRead ? 'normal' : 'bold', color: item.isRead ? 'rgba(255,255,255,0.85)' : '#fff' }}>{item.title}</span>}
                description={
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.message}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{new Date(item.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                }
              />
            </List.Item>
          </motion.div>
        )}
      />

      <div style={{ textAlign: 'center', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
        <Button
          type="text"
          style={{ color: '#1890ff' }}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Thu gọn' : 'Xem tất cả thông báo'}
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Popover
        content={content}
        title="Thông báo"
        trigger="click"
        placement="bottomRight"
        open={open}
        onOpenChange={(visible: boolean) => {
          setOpen(visible);
          if (visible) {
            fetchNotifications(); // Refresh when opening
          }
        }}
        overlayInnerStyle={{
          backgroundColor: 'rgba(30, 30, 35, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          padding: '16px 8px'
        }}
      >
        <Badge count={unreadCount} style={{ backgroundColor: '#ff4d4f', boxShadow: '0 0 10px rgba(255,77,79,0.5)' }}>
          <div style={{ 
            padding: 8, 
            borderRadius: '50%', 
            background: open ? 'rgba(255,255,255,0.1)' : 'transparent',
            transition: 'all 0.3s'
          }}>
            <BellOutlined
              style={{
                fontSize: 22,
                cursor: 'pointer',
                color: '#fff',
              }}
            />
          </div>
        </Badge>
      </Popover>

      {/* Modal hiển thị chi tiết Thông Báo */}
      <Modal
        open={!!selectedNotif}
        onCancel={() => setSelectedNotif(null)}
        footer={null}
        centered
        width={450}
        closeIcon={<span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 20 }}>×</span>}
        styles={{
          mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)' },
          content: { 
            background: 'linear-gradient(145deg, #1f1f25, #141419)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          },
          body: { padding: '32px 24px 24px' }
        } as any}
      >
        <AnimatePresence>
          {selectedNotif && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                width: 64, height: 64, borderRadius: '50%', 
                background: 'rgba(24,144,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                border: '1px solid rgba(24,144,255,0.3)',
                boxShadow: '0 0 20px rgba(24,144,255,0.2)'
              }}>
                <InfoCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              </div>
              
              <Typography.Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
                {selectedNotif.title}
              </Typography.Title>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '16px 20px', 
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.05)',
                marginBottom: 24,
                textAlign: 'left'
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {selectedNotif.message}
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                  <BellOutlined style={{ marginRight: 4 }} />
                  {new Date(selectedNotif.createdAt).toLocaleString('vi-VN')}
                </Text>
                
                <Space>
                  {(selectedNotif.title.includes('đăng ký') || selectedNotif.message.includes('đăng ký')) && (
                    <Button 
                      type="primary" 
                      onClick={() => {
                        setSelectedNotif(null);
                        navigate('/manage-registrations');
                      }}
                      style={{ borderRadius: 8, background: 'linear-gradient(90deg, #1890ff, #722ed1)', border: 'none' }}
                    >
                      Đến trang đăng ký
                    </Button>
                  )}
                  <Button 
                    onClick={() => setSelectedNotif(null)}
                    style={{ borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
                  >
                    Đóng
                  </Button>
                </Space>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
};

export default NotificationBell;