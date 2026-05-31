import React, { useEffect, useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Typography, Spin, Space, Tag, Empty, Avatar } from 'antd';
import { TeamOutlined, UserOutlined, TrophyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { getTournaments } from '@/services/adminTournament.service';
import { getTournamentById } from '@/services/tournament.service';
import './teams.css';

const { Title, Text } = Typography;

export default function TeamsPage() {
  const [tournamentsWithDetails, setTournamentsWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollWrpRef = useRef<HTMLDivElement>(null);
  const [expandedTours, setExpandedTours] = useState<Record<string, boolean>>({});

  const toggleTournament = (id: string) => {
    setExpandedTours(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all tournaments
      const res = await getTournaments({ limit: 100 });
      let tours = [];
      if (res.success !== false) {
        tours = res.data?.data || res.data || [];
      }

      // 2. Fetch details for all tournaments to get the registrations
      const detailsPromises = tours.map((t: any) => getTournamentById(t.id));
      const detailsResults = await Promise.all(detailsPromises);
      
      setTournamentsWithDetails(detailsResults.filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || tournamentsWithDetails.length === 0) return;

    // Set up IntersectionObserver for the scroll items
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        root: scrollWrpRef.current,
        rootMargin: '0px',
        threshold: 0.3, // Item must be 30% visible to trigger
      }
    );

    const items = document.querySelectorAll('.scroll-item');
    items.forEach((item) => observer.current?.observe(item));

    return () => {
      observer.current?.disconnect();
    };
  }, [loading, tournamentsWithDetails]);

  return (
    <PageContainer title="Danh sách Đội tham gia">
      <Spin spinning={loading} tip="Đang tải dữ liệu các đội...">
        {!loading && tournamentsWithDetails.length > 0 ? (
          <div className="scroll-list__wrp" ref={scrollWrpRef}>
            {tournamentsWithDetails.map((tournament) => (
              <div key={tournament.id} className="scroll-item">
                <div 
                  style={{ marginBottom: expandedTours[tournament.id] ? 24 : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => toggleTournament(tournament.id)}
                >
                  <div>
                    <Title level={3} style={{ margin: 0, color: '#fff' }}>
                      <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                      {tournament.name}
                    </Title>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color="cyan">{tournament.game}</Tag>
                      <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {tournament.registrations?.length || 0} đội đã được duyệt
                      </Text>
                    </Space>
                  </div>
                  <div>
                    {expandedTours[tournament.id] ? <UpOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}/> : <DownOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}/>}
                  </div>
                </div>

                {expandedTours[tournament.id] && (
                  tournament.registrations?.length > 0 ? (
                    <List
                      rowKey="id"
                      grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
                      dataSource={tournament.registrations}
                      renderItem={(reg: any) => (
                        <List.Item>
                            <Card
                              hoverable
                              className="team-card"
                              bodyStyle={{ padding: 20 }}
                            >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                              <Avatar 
                                size={48} 
                                icon={<TeamOutlined />} 
                                src={reg.teamLogo}
                                style={{ backgroundColor: '#1890ff', marginRight: 16 }} 
                              />
                              <div>
                                <Title level={5} style={{ margin: 0, color: '#40a9ff' }}>
                                  {reg.teamName}
                                </Title>
                                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                                  Đại diện: {reg.user?.username}
                                </Text>
                              </div>
                            </div>

                            <div>
                              <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>
                                Thành viên ({reg.members?.length || 0}):
                              </Text>
                              <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                {reg.members?.map((member: any) => (
                                  <div key={member.id} style={{ display: 'flex', alignItems: 'center' }}>
                                    <UserOutlined style={{ color: '#8c8c8c', marginRight: 8 }} />
                                    <Text style={{ color: 'rgba(255,255,255,0.85)' }}>{member.memberName}</Text>
                                    <Text style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                      ID: {member.gameId}
                                    </Text>
                                  </div>
                                ))}
                              </Space>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="Chưa có đội nào đăng ký thành công cho giải đấu này." />
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          !loading && <Empty description="Chưa có giải đấu nào" style={{ marginTop: 100 }} />
        )}
      </Spin>
    </PageContainer>
  );
}
