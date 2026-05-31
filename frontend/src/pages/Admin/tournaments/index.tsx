import React, { useEffect, useState } from 'react';
import {
  Card,
  Space,
  Button,
  Input,
  Select,
  Table,
  Tag,
  Badge,
  Popconfirm,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
} from '@/services/adminTournament.service';

interface Tournament {
  id: string;
  name: string;
  game: string;
  banner: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  prizePool?: string;
  status: 'UPCOMING' | 'ONGOING' | 'FINISHED';
  format: 'SINGLE_ELIMINATION' | 'ROUND_ROBIN';
  _count?: {
    registrations: number;
  };
  createdAt: string;
}

const GAME_COLORS: Record<string, string> = {
  'Liên Quân Mobile': 'blue',
  'PUBG Mobile': 'orange',
  'Free Fire': 'red',
  'League of Legends': 'gold',
  'VALORANT': 'volcano',
  'FC Online': 'green',
  'Mobile Legends: Bang Bang': 'cyan',
  'Teamfight Tactics': 'geekblue',
  'Counter-Strike 2': 'yellow',
  'Dota 2': 'purple',
};

const STATUS_BADGE: Record<string, 'processing' | 'success' | 'default'> = {
  UPCOMING: 'processing',
  ONGOING: 'success',
  FINISHED: 'default',
};

export default function AdminTournamentsPage() {
  const [data, setData] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [game, setGame] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await getTournaments({
        page,
        limit,
        search,
        game,
        status,
      });
      if (res.success) {
        setData(res.data.data);
        setTotal(res.data.total);
      }
    } catch (error) {
      message.error('Lỗi khi lấy danh sách giải đấu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [page, limit, search, game, status]);

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTournament(id);
      message.success('Xóa giải đấu thành công');
      fetchTournaments();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa giải đấu');
    }
  };

  const openModal = (record?: Tournament) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        name: record.name,
        game: record.game,
        banner: record.banner,
        startDate: dayjs(record.startDate),
        endDate: dayjs(record.endDate),
        maxTeams: record.maxTeams,
        prizePool: record.prizePool,
        status: record.status,
        format: record.format || 'SINGLE_ELIMINATION',
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ status: 'UPCOMING', format: 'SINGLE_ELIMINATION' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);

      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
      };

      if (editingId) {
        await updateTournament(editingId, payload);
        message.success('Cập nhật giải đấu thành công');
      } else {
        await createTournament(payload);
        message.success('Tạo giải đấu thành công');
      }

      closeModal();
      fetchTournaments();
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Có lỗi xảy ra');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns: ColumnsType<Tournament> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Tên giải',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Game',
      dataIndex: 'game',
      key: 'game',
      render: (game: string) => (
        <Tag color={GAME_COLORS[game] || 'default'}>{game}</Tag>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Đã đăng ký',
      key: 'registered',
      render: (_, record) => (
        <span>
          {record._count?.registrations || 0} / {record.maxTeams}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={STATUS_BADGE[status] || 'default'} text={status} />
      ),
    },
    {
      title: 'Kiểu giải đấu',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => (
        <Tag color={format === 'ROUND_ROBIN' ? 'purple' : format === 'SURVIVAL_STAGE' ? 'green' : 'gold'}>
          {format === 'ROUND_ROBIN' ? '🔄 Vòng bảng' : format === 'SURVIVAL_STAGE' ? '🪂 Sinh tồn' : '🏆 Nhánh cây'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa giải đấu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản lý giải đấu"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm giải đấu
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} size={8}>
        <Input.Search
          placeholder="Tìm tên giải..."
          allowClear
          style={{ width: 240 }}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <Select
          placeholder="Tất cả game"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setGame(value);
            setPage(1);
          }}
          options={[
            { label: 'Liên Quân Mobile', value: 'Liên Quân Mobile' },
            { label: 'PUBG Mobile', value: 'PUBG Mobile' },
            { label: 'Free Fire', value: 'Free Fire' },
            { label: 'League of Legends', value: 'League of Legends' },
            { label: 'VALORANT', value: 'VALORANT' },
            { label: 'FC Online', value: 'FC Online' },
            { label: 'Mobile Legends: Bang Bang', value: 'Mobile Legends: Bang Bang' },
            { label: 'Teamfight Tactics', value: 'Teamfight Tactics' },
            { label: 'Counter-Strike 2', value: 'Counter-Strike 2' },
            { label: 'Dota 2', value: 'Dota 2' },
          ]}
        />
        <Select
          placeholder="Tất cả trạng thái"
          allowClear
          style={{ width: 160 }}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          options={[
            { label: 'UPCOMING', value: 'UPCOMING' },
            { label: 'ONGOING', value: 'ONGOING' },
            { label: 'FINISHED', value: 'FINISHED' },
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingId ? 'Chỉnh sửa giải đấu' : 'Thêm giải đấu'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={submitLoading}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="name"
            label="Tên giải đấu"
            rules={[{ required: true, message: 'Vui lòng nhập tên giải đấu' }]}
          >
            <Input placeholder="Nhập tên giải" />
          </Form.Item>

          <Form.Item
            name="game"
            label="Game"
            rules={[{ required: true, message: 'Vui lòng chọn game' }]}
          >
            <Select
              placeholder="Chọn game"
              options={[
                { label: 'Liên Quân Mobile', value: 'Liên Quân Mobile' },
                { label: 'PUBG Mobile', value: 'PUBG Mobile' },
                { label: 'Free Fire', value: 'Free Fire' },
                { label: 'League of Legends', value: 'League of Legends' },
                { label: 'VALORANT', value: 'VALORANT' },
                { label: 'FC Online', value: 'FC Online' },
                { label: 'Mobile Legends: Bang Bang', value: 'Mobile Legends: Bang Bang' },
                { label: 'Teamfight Tactics', value: 'Teamfight Tactics' },
                { label: 'Counter-Strike 2', value: 'Counter-Strike 2' },
                { label: 'Dota 2', value: 'Dota 2' },
              ]}
            />
          </Form.Item>

          <Form.Item name="banner" label="Banner URL">
            <Input placeholder="Nhập link ảnh banner" />
          </Form.Item>

          <Form.Item name="prizePool" label="Cơ cấu giải thưởng">
            <Input.TextArea rows={2} placeholder="Nhập cơ cấu giải thưởng (VD: Tổng 10.000.000 VNĐ - Top 1: 5tr, Top 2: 3tr)" />
          </Form.Item>

          <Space style={{ display: 'flex' }} align="start">
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              dependencies={['startDate']}
              rules={[
                { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startDate');
                    if (!value || !start || value.isAfter(start) || value.isSame(start)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'));
                  },
                }),
              ]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex' }} align="start">
            <Form.Item
              name="maxTeams"
              label="Số đội tối đa"
              rules={[
                { required: true, message: 'Vui lòng nhập số đội tối đa' },
                {
                  validator: (_, value) => {
                    if (value && value % 2 !== 0) {
                      return Promise.reject(new Error('Số đội tối đa phải là số chẵn'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber min={2} step={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
              <Select
                options={[
                  { label: 'UPCOMING', value: 'UPCOMING' },
                  { label: 'ONGOING', value: 'ONGOING' },
                  { label: 'FINISHED', value: 'FINISHED' },
                ]}
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="format"
            label="Kiểu giải đấu"
            rules={[{ required: true, message: 'Vui lòng chọn kiểu giải đấu' }]}
          >
            <Select
              placeholder="Chọn kiểu giải đấu"
              options={[
                {
                  label: '🏆 Nhánh cây (Loại trực tiếp)',
                  value: 'SINGLE_ELIMINATION',
                },
                {
                  label: '🔄 Vòng bảng (Round Robin)',
                  value: 'ROUND_ROBIN',
                },
                {
                  label: '🪂 Sinh tồn (Survival Stage)',
                  value: 'SURVIVAL_STAGE',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}