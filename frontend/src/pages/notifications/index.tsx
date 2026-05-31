import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { List, Card, Tabs, Badge, Typography, Button, message, Space } from 'antd';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/motion/PageTransition';
import { FadeIn } from '@/components/motion/AnimatedList';

const { Text } = Typography;
const { TabPane } = Tabs;

const NotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ data: [], total: 0 });
  const [current, setCurrent] = useState(1);

  const fetchData = async (page: number, type: string) => {
    setLoading(true);
    try {
      const res = await request('/api/notifications/my', {
        method: 'GET',
        params: { 
          page, 
          limit: 10,
          status: type === 'unread' ? 'false' : undefined 
        },
      });
      setData(res);
    } catch (error) {
      message.error('Không thể tải danh sách thông báo');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(current, activeTab);
  }, [current, activeTab]);

  const handleMarkAsRead = async (id: number) => {
    await request(`/api/notifications/${id}/read`, { method: 'PATCH' });
    fetchData(current, activeTab);
  };

  return (
    <PageContainer title="Thông báo của tôi">
      <PageTransition>
      <Card>
        {/* Sửa lỗi property 'items' does not exist */}
        <Tabs activeKey={activeTab} onChange={(key) => { setActiveTab(key); setCurrent(1); }}>
          <TabPane tab="Tất cả thông báo" key="all" />
          <TabPane tab="Chưa đọc" key="unread" />
        </Tabs>
        
        <List
          itemLayout="horizontal"
          loading={loading}
          dataSource={data.data}
          pagination={{
            current: current,
            pageSize: 10,
            total: data.total,
            onChange: (page) => setCurrent(page),
            // Bỏ thuộc tính 'align' vì phiên bản cũ không hỗ trợ
            style: { marginTop: 24, textAlign: 'center' } 
          }}
          renderItem={(item: any, index: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
            >
            <List.Item
              actions={[
                !item.isRead && (
                  <Button type="link" onClick={() => handleMarkAsRead(item.id)}>
                    Đánh dấu đã đọc
                  </Button>
                ),
              ]}
              style={{ 
                backgroundColor: item.isRead ? 'transparent' : '#f0f7ff',
                padding: '16px 24px',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong={!item.isRead}>{item.title}</Text>
                    {!item.isRead && <Badge status="processing" color="blue" />}
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 4 }}>{item.message}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {item.createdAt ? dayjs(item.createdAt).format('DD/MM/YYYY HH:mm') : ''}
                    </Text>
                  </div>
                }
              />
            </List.Item>
            </motion.div>
          )}
        />
      </Card>
      </PageTransition>
    </PageContainer>
  );
};

export default NotificationPage;