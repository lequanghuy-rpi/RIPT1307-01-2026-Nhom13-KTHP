import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Space,
  DatePicker,
  Button,
  Table,
  Tag,
  Progress,
  message,
  Spin,
} from 'antd';
import {
  TrophyOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import * as XLSX from 'xlsx';

import {
  getOverview,
  getRegistrationsByDate,
  getStatusDistribution,
  getTopTournaments,
} from '@/services/adminStatistics.service';

const { RangePicker } = DatePicker;

interface TopTournament {
  id: string;
  name: string;
  game: string;
  total: number;
  approved: number;
  rate: number;
}

const GAME_COLORS: Record<string, string> = {
  'Liên Quân Mobile': 'blue',
  'PUBG Mobile': 'orange',
  'Free Fire': 'red',
  'League of Legends': 'gold',
  'Tốc Chiến': 'cyan',
  'VALORANT': 'volcano',
  'FC Online': 'green',
  'Mobile Legends: Bang Bang': 'cyan',
  'Teamfight Tactics': 'geekblue',
  'Counter-Strike 2': 'yellow',
  'Dota 2': 'purple',
  'Identity V': 'magenta',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ffa940',
  APPROVED: '#73d13d',
  REJECTED: '#ff7875',
};

export default function AdminStatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Date Range
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  // Data States
  const [overview, setOverview] = useState({
    totalTournaments: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
  });
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [topTournaments, setTopTournaments] = useState<TopTournament[]>([]);

  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      
      const startDate = dateRange?.[0]?.format('YYYY-MM-DD');
      const endDate = dateRange?.[1]?.format('YYYY-MM-DD');

      const [overviewRes, lineRes, pieRes, topRes] = await Promise.all([
        getOverview(),
        getRegistrationsByDate({ startDate, endDate }),
        getStatusDistribution(),
        getTopTournaments({ startDate, endDate }),
      ]);

      setOverview(overviewRes || {
        totalTournaments: 0,
        totalRegistrations: 0,
        pendingRegistrations: 0,
        approvedRegistrations: 0,
      });

      if (lineRes?.data) setLineData(lineRes.data);
      if (pieRes?.data) setPieData(pieRes.data);
      if (topRes?.data) setTopTournaments(topRes.data);

    } catch (error) {
      message.error('Lỗi khi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleExportExcel = () => {
    if (!topTournaments || topTournaments.length === 0) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }
    
    const excelData = topTournaments.map((item, index) => ({
      'STT': index + 1,
      'Tên giải': item.name,
      'Game': item.game,
      'Tổng đăng ký': item.total,
      'Đã duyệt': item.approved,
      'Tỷ lệ duyệt (%)': item.rate
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ThongKeGiaiDau");
    XLSX.writeFile(wb, `ThongKeGiaiDau_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
  };

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'count',
    smooth: true,
    color: '#b37feb',
    theme: 'dark',
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#141414',
        stroke: '#b37feb',
        lineWidth: 2,
      },
    },
    tooltip: { showMarkers: true },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'count',
    colorField: 'status',
    innerRadius: 0.6,
    theme: 'dark',
    color: ({ status }: any) => STATUS_COLORS[status] || '#d9d9d9',
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Trạng\nthái',
      },
    },
  };

  const columns: ColumnsType<TopTournament> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên giải',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
      render: (game: string) => <Tag color={GAME_COLORS[game] || 'default'}>{game}</Tag>,
    },
    {
      title: 'Tổng đăng ký',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (val: number) => <strong>{val}</strong>,
    },
    {
      title: 'Đã duyệt',
      dataIndex: 'approved',
      key: 'approved',
      align: 'center',
      render: (val: number) => <span style={{ color: '#73d13d' }}>{val}</span>,
    },
    {
      title: 'Tỷ lệ duyệt',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => <Progress percent={rate} size="small" status="active" />,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Card
        title="Thống kê hệ thống"
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as any)}
              allowClear={false}
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
              Làm mới
            </Button>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {/* STATISTIC CARDS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card bordered={false} style={{ backgroundColor: 'rgba(114, 46, 209, 0.15)', border: '1px solid rgba(114, 46, 209, 0.3)' }}>
              <Statistic
                title={<span style={{ color: '#d3adf7', fontWeight: 500 }}>Tổng giải đấu</span>}
                value={overview.totalTournaments}
                valueStyle={{ color: '#b37feb', fontWeight: 'bold' }}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ backgroundColor: 'rgba(24, 144, 255, 0.15)', border: '1px solid rgba(24, 144, 255, 0.3)' }}>
              <Statistic
                title={<span style={{ color: '#85a5ff', fontWeight: 500 }}>Tổng đăng ký</span>}
                value={overview.totalRegistrations}
                valueStyle={{ color: '#69c0ff', fontWeight: 'bold' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ backgroundColor: 'rgba(250, 140, 22, 0.15)', border: '1px solid rgba(250, 140, 22, 0.3)' }}>
              <Statistic
                title={<span style={{ color: '#ffd591', fontWeight: 500 }}>Chờ duyệt</span>}
                value={overview.pendingRegistrations}
                valueStyle={{ color: '#ffc069', fontWeight: 'bold' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ backgroundColor: 'rgba(82, 196, 26, 0.15)', border: '1px solid rgba(82, 196, 26, 0.3)' }}>
              <Statistic
                title={<span style={{ color: '#b7eb8f', fontWeight: 500 }}>Đã duyệt</span>}
                value={overview.approvedRegistrations}
                valueStyle={{ color: '#95de64', fontWeight: 'bold' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* CHARTS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={14}>
            <Card title="Đăng ký theo ngày" bordered>
              <div style={{ height: 300 }}>
                {lineData.length > 0 ? (
                  <Line {...lineConfig} />
                ) : (
                  <div style={{ textAlign: 'center', marginTop: 120, color: '#bfbfbf' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Tỷ lệ trạng thái" bordered>
              <div style={{ height: 300 }}>
                {pieData.length > 0 ? (
                  <Pie {...pieConfig} />
                ) : (
                  <div style={{ textAlign: 'center', marginTop: 120, color: '#bfbfbf' }}>
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* TOP TOURNAMENTS TABLE */}
        <Card 
          title="Top giải đấu theo lượt đăng ký" 
          bordered
          extra={
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
            >
              Xuất Excel
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={topTournaments}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Card>
    </Spin>
  );
}
