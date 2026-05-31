import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Card, Typography, Tag, Space, Button, Statistic, Form, Input, message } from 'antd';
import { TrophyOutlined, BellOutlined, PlusOutlined, SearchOutlined, BarChartOutlined, TeamOutlined, CheckCircleOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { useModel, history } from '@umijs/max';
import { getOverview } from '@/services/adminStatistics.service';
import { broadcastNotification } from '@/services/notification';
import { StaggerContainer, AnimatedItem, FadeIn } from '@/components/motion/AnimatedList';
import PageTransition from '@/components/motion/PageTransition';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;

const GAMES = [
  {
    name: "Liên Quân Mobile",
    tournaments: ["Đấu Trường Danh Vọng (ĐTDV)", " AIC", "AWC", "APL", "GCS"],
    description: "Có thể xem là game esports mobile mạnh nhất VN nhiều năm liền.",
    bgImage: "https://cdn-media.sforum.vn/storage/app/media/tao-tai-khoan-lien-quan-thumbail.jpg"
  },
  {
    name: "PUBG Mobile",
    tournaments: ["PMPL Vietnam", "PMGC"],
    description: "Việt Nam hiện là một trong những khu vực mạnh của PUBG Mobile.",
    bgImage: "https://cdn1.epicgames.com/spt-assets/53ec4985296b4facbe3a8d8d019afba9/pubg-battlegrounds-19vwb.jpg?resize=1&w=480&h=270&quality=medium"
  },
  {
    name: "Free Fire",
    tournaments: ["Free Fire World Series"],
    description: "Cực phổ biến ở học sinh/sinh viên và máy cấu hình thấp.",
    bgImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl8ChEz5aiEtyp5HkGleh0-J3JH8tUGCF3Hw&s"
  },
  {
    name: "League of Legends",
    tournaments: ["VCS"],
    description: "Dù không còn peak như trước nhưng vẫn là tượng đài esports PC tại VN.",
    bgImage: "https://cellphones.com.vn/sforum/wp-content/uploads/2022/11/lol-la-gi-0-1.jpg"
  },
  {
    name: "VALORANT",
    tournaments: ["VCT Challengers Vietnam"],
    description: "Tăng trưởng rất mạnh vài năm gần đây.",
    bgImage: "https://www.riotgames.com/darkroom/1200/1dbd7211e78ce5faa7a8af9d10afad47:2b5979e3922758399ba389561e797919/ps-f2p-val-console-launch-16x9.jpg"
  },
  {
    name: "FC Online",
    tournaments: ["FVPL"],
    description: "Cộng đồng bóng đá ở VN rất đông nên game này luôn top.",
    bgImage: "https://yt3.googleusercontent.com/4W8oATzTPHLlUha4Jk4WXGvvvnoEqvCXvEv88tBYDfWo1atYM7R4zXTgTqeD0R75PTu5vor0aQ=s900-c-k-c0x00ffffff-no-rj"
  },
  {
    name: "Mobile Legends: Bang Bang",
    tournaments: [],
    description: "Dù chưa mạnh bằng Liên Quân ở VN nhưng đang tăng rất nhanh toàn SEA.",
    bgImage: "https://cdn-www.bluestacks.com/bs-images/MLBB_KAL_ENG_1.jpg"
  },
  {
    name: "Teamfight Tactics",
    tournaments: ["TFT Open", "Esports Nations Cup"],
    description: "Game chiến thuật có lượng streamer/view khá lớn.",
    bgImage: "https://cdn1.epicgames.com/offer/ada73cc2d68a46a18f529ebb87328dee/EGS_TeamfightTactics_RiotGames_S1_2560x1440-7169170239c742b19f85abb788ea1e3f"
  },
  {
    name: "Counter-Strike 2",
    tournaments: [],
    description: "Ở VN chưa mainstream bằng Valorant nhưng cộng đồng FPS hardcore rất mạnh.",
    bgImage: "https://cdn-media.sforum.vn/storage/app/media/nhuy/nhuy/Nhu-Y/cau-hinh-choi-cs2-2.jpg"
  }
];

export default function HomePage() {
  const { initialState } = useModel('@@initialState');
  const isAdmin = initialState?.role === 'ADMIN';

  const [overview, setOverview] = React.useState({
    totalTournaments: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
  });

  const [form] = Form.useForm();
  const [broadcasting, setBroadcasting] = React.useState(false);

  const handleBroadcast = async (values: { title: string; message: string }) => {
    try {
      setBroadcasting(true);
      await broadcastNotification(values);
      message.success('Đã gửi thông báo đến toàn bộ người dùng!');
      form.resetFields();
    } catch (error) {
      message.error('Gửi thông báo thất bại');
      console.error(error);
    } finally {
      setBroadcasting(false);
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      getOverview()
        .then((res) => {
          if (res && res.success !== false) {
            setOverview(res); // assuming getOverview returns the object directly
          }
        })
        .catch((err) => console.error('Failed to fetch overview stats', err));
    }
  }, [isAdmin]);

  return (
    <PageContainer
      title={false}
      header={{
        title: <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>Trang chủ</Title>,
        extra: [
          isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push('/admin/tournaments')}
              key="add"
            >
              Tạo giải đấu
            </Button>
          ),
          isAdmin && (
            <Button
              type="default"
              icon={<BarChartOutlined />}
              onClick={() => history.push('/admin/statistics')}
              key="stats"
            >
              Thống kê
            </Button>
          ),
        ].filter(Boolean)
      }}
    >
      <PageTransition>
      <FadeIn style={{ marginBottom: 24, textAlign: 'center' }}>
        <Title level={2}>Hệ Sinh Thái Thể Thao Điện Tử Việt Nam</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Khám phá các tựa game Esports phổ biến nhất cùng hệ thống giải đấu chuyên nghiệp
        </Paragraph>
      </FadeIn>

      {isAdmin && (
        <FadeIn delay={0.1} style={{ marginBottom: 32 }}>
          <Card 
            title={<span style={{ color: '#fff' }}><BellOutlined /> Gửi thông báo toàn hệ thống</span>} 
            bordered={false} 
            style={{ borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Form form={form} layout="vertical" onFinish={handleBroadcast}>
              <Form.Item name="title" label={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Tiêu đề thông báo</span>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                <Input placeholder="Ví dụ: Bảo trì hệ thống tối nay" />
              </Form.Item>
              <Form.Item name="message" label={<span style={{ color: 'rgba(255,255,255,0.85)' }}>Nội dung chi tiết</span>} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                <Input.TextArea rows={3} placeholder="Ví dụ: Server sẽ bảo trì từ 22:00 đến 00:00..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={broadcasting}>
                Gửi thông báo ngay
              </Button>
            </Form>
          </Card>
        </FadeIn>
      )}

      {isAdmin && (
        <FadeIn delay={0.15} style={{ marginBottom: 32 }}>
          <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
            Thống Kê Tổng Quan
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} style={{ borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.65)' }}>Tổng Giải Đấu</span>}
                  value={overview.totalTournaments}
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} style={{ borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.65)' }}>Đội Tham Gia</span>}
                  value={overview.totalRegistrations}
                  prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} style={{ borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.65)' }}>Đang Chờ Duyệt</span>}
                  value={overview.pendingRegistrations}
                  prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card bordered={false} style={{ borderRadius: 12, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.65)' }}>Đã Duyệt</span>}
                  value={overview.approvedRegistrations}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </Card>
            </Col>
          </Row>
        </FadeIn>
      )}

      <StaggerContainer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {GAMES.map((game, index) => (
          <AnimatedItem
            key={index}
          >
            <Card
              hoverable
              className={styles.gameCard}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 12,
                overflow: 'hidden',
                border: 'none',
              }}
              bodyStyle={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundImage: game.bgImage && game.bgImage.trim()
                  ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.85)), url(${JSON.stringify(game.bgImage.trim())})`
                  : 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.85))',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '24px',
              }}
            >
              <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
                {game.name}
              </Title>

              <div style={{ flex: 1 }}>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: 16 }}>
                  {game.description}
                </Paragraph>
              </div>

              {game.tournaments.length > 0 && (
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>
                    <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                    Giải đấu tiêu biểu:
                  </Text>
                  <Space size={[0, 8]} wrap>
                    {game.tournaments.map((t, idx) => (
                      <Tag color="volcano" key={idx} style={{ border: 'none' }}>{t}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>
          </AnimatedItem>
        ))}
      </StaggerContainer>
      </PageTransition>
    </PageContainer>
  );
}