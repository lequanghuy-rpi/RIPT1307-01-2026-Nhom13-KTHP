import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Input, Select, Badge, Tag, Button, Pagination, Space, Skeleton, Typography } from 'antd';
import { useNavigate, request } from '@umijs/max';
import dayjs from 'dayjs';
import PageTransition from '@/components/motion/PageTransition';
import { StaggerContainer, AnimatedItem } from '@/components/motion/AnimatedList';

const { Title, Text } = Typography;

interface TournamentItem {
  id: string;
  name: string;
  game: string;
  status: string;
  startDate: string;
  endDate: string;
  banner?: string | null;
  maxTeams: number;
  _count?: {
    registrations: number;
  };
}



const TournamentList: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TournamentItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [gameFilter, setGameFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchList();
  }, [page, searchText, gameFilter, statusFilter]);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await request('/api/tournaments', { 
        params: { 
          page, 
          limit: 6, 
          search: searchText, 
          game: gameFilter, 
          status: statusFilter 
        } 
      });
      
      if (res && res.success) {
        setItems(res.data.data || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Sắp diễn ra':
      case 'UPCOMING':
        return <Badge status="processing" text={<Text strong style={{ color: '#1890ff' }}>Sắp diễn ra</Text>} />;
      case 'Đang diễn ra':
      case 'ONGOING':
        return <Badge status="success" text={<Text strong style={{ color: '#52c41a' }}>Đang diễn ra</Text>} />;
      case 'Đã kết thúc':
      case 'FINISHED':
        return <Badge status="default" text={<Text strong style={{ color: '#8c8c8c' }}>Đã kết thúc</Text>} />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  return (
    <PageContainer title="Danh sách giải đấu">
      <PageTransition>
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input.Search 
            placeholder="Tìm tên giải đấu..." 
            allowClear 
            onSearch={val => { setSearchText(val); setPage(1); }} 
            style={{ width: 250 }} 
          />
          <Select 
            placeholder="Chọn Game" 
            allowClear 
            style={{ width: 200 }}
            onChange={val => { setGameFilter(val); setPage(1); }}
            options={[
              { value: 'Liên Quân Mobile', label: 'Liên Quân Mobile' },
              { value: 'PUBG Mobile', label: 'PUBG Mobile' },
              { value: 'Free Fire', label: 'Free Fire' },
              { value: 'League of Legends', label: 'League of Legends' },
              { value: 'VALORANT', label: 'VALORANT' },
              { value: 'FC Online', label: 'FC Online' },
              { value: 'Mobile Legends: Bang Bang', label: 'Mobile Legends: Bang Bang' },
              { value: 'Teamfight Tactics', label: 'Teamfight Tactics' },
              { value: 'Counter-Strike 2', label: 'Counter-Strike 2' },
            ]}
          />
          <Select 
            placeholder="Trạng thái" 
            allowClear 
            style={{ width: 200 }}
            onChange={val => { setStatusFilter(val); setPage(1); }}
            options={[
              { value: 'Sắp diễn ra', label: 'Sắp diễn ra' },
              { value: 'Đang diễn ra', label: 'Đang diễn ra' },
              { value: 'Đã kết thúc', label: 'Đã kết thúc' },
            ]}
          />
        </Space>
      </Card>

      <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginTop: 0 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <AnimatedItem key={`skeleton-${i}`}>
              <Card>
                <Skeleton.Image active style={{ width: '100%', height: 160, marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </AnimatedItem>
          ))
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', gridColumn: '1 / -1' }}>
            <Text type="secondary">Không tìm thấy giải đấu nào.</Text>
          </div>
        ) : (
          items.map(t => (
            <AnimatedItem key={t.id}>
              <Card 
                hoverable 
                cover={
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <img 
                      alt={t.name} 
                      src={t.banner || 'https://via.placeholder.com/400x200?text=No+Image'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <Tag color="magenta" style={{ margin: 0, fontWeight: 'bold' }}>{t.game}</Tag>
                    </div>
                  </div>
                }
                actions={[
                  <Button type="primary" onClick={() => navigate(`/tournaments/${t.id}`)}>Xem chi tiết</Button>
                ]}
              >
                <Card.Meta 
                  title={<Title level={5} ellipsis>{t.name}</Title>} 
                  description={
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <div style={{ marginBottom: 8 }}>
                        {getStatusTag(t.status)}
                      </div>
                      <Text type="secondary">
                        📅 {dayjs(t.startDate).format('DD/MM/YYYY')} - {dayjs(t.endDate).format('DD/MM/YYYY')}
                      </Text>
                      <Text type="secondary">
                        👥 Teams: {t._count?.registrations || 0} / {t.maxTeams}
                      </Text>
                    </Space>
                  } 
                />
              </Card>
            </AnimatedItem>
          ))
        )}
      </StaggerContainer>

      {!loading && items.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <Pagination 
            current={page} 
            total={total} 
            pageSize={6} 
            onChange={(p) => setPage(p)} 
            showSizeChanger={false}
          />
        </div>
      )}
      </PageTransition>
    </PageContainer>
  );
};

export default TournamentList;
