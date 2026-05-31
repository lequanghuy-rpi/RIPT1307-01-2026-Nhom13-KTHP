import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag, Typography, Card, Space } from 'antd';
import { request } from '@umijs/max';
import dayjs from 'dayjs';

const { Text } = Typography;

interface RegistrationItem {
  id: string;
  teamName: string;
  status: string;
  createdAt: string;
  tournament: {
    name: string;
  };
}



const MyRegistrations: React.FC = () => {
  const [data, setData] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRegistrations();
  }, [page]);

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const res = await request('/api/registrations/my', { method: 'GET' });
      if (res && res.success) {
        setData(res.data || []);
        setTotal(res.data?.length || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'Tên Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Tên Giải Đấu',
      dataIndex: ['tournament', 'name'],
      key: 'tournamentName',
    },
    {
      title: 'Ngày Đăng Ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(date).format('HH:mm')}</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let label = status;
        
        switch(status) {
          case 'APPROVED':
            color = 'success';
            label = 'Đã duyệt';
            break;
          case 'PENDING':
            color = 'processing';
            label = 'Chờ duyệt';
            break;
          case 'REJECTED':
            color = 'error';
            label = 'Từ chối';
            break;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  return (
    <PageContainer title="Giải đấu đã đăng ký">
      <Card>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total: total,
            onChange: (p) => setPage(p)
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default MyRegistrations;
