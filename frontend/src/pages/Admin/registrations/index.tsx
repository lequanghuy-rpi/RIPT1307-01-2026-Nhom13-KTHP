import React, { useEffect, useState } from 'react';
import {
  Card,
  Space,
  Button,
  Select,
  Table,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Input,
  Drawer,
  List,
  Avatar,
  message,
  Typography,
} from 'antd';
import { DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

import {
  getAdminRegistrations,
  approveRegistration,
  rejectRegistration,
  exportRegistrationsExcel,
  updateRegistrationInfo,
} from '@/services/adminRegistration.service';
import { getTournaments } from '@/services/adminTournament.service';
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';

interface Member {
  id: string;
  memberName: string;
  gameId: string;
}

interface Registration {
  id: string;
  teamName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  note: string | null;
  createdAt: string;
  user: { id: string; username: string; email: string };
  tournament: { id: string; name: string; game: string };
  members: Member[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

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

export default function AdminRegistrationsPage() {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tournamentId, setTournamentId] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Reject Modal
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const [actionLoading, setActionLoading] = useState(false);
  const [currentRejectId, setCurrentRejectId] = useState<string | null>(null);

  // Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  
  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [page, limit, tournamentId, statusFilter]);

  const fetchTournaments = async () => {
    try {
      const res = await getTournaments({ limit: 100 });
      if (res.success) {
        setTournaments(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (tournamentId) params.tournamentId = tournamentId;
      if (statusFilter) params.status = statusFilter;

      const res = await getAdminRegistrations(params);
      if (res.success) {
        setData(res.data.data);
        setTotal(res.data.total);
      }
    } catch (error: any) {
      console.error('Fetch Registrations Error:', error.response?.data || error.message || error);
      message.error(error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(true);
      await approveRegistration(id);
      message.success('Đã duyệt đơn đăng ký');
      if (drawerVisible && selectedReg?.id === id) {
        setDrawerVisible(false);
      }
      fetchRegistrations();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi duyệt');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentRejectId(id);
    rejectForm.resetFields();
    setRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields();
      if (!currentRejectId) return;

      setActionLoading(true);
      await rejectRegistration(currentRejectId, values.note);
      message.success('Đã từ chối đơn đăng ký');

      setRejectModalVisible(false);
      if (drawerVisible && selectedReg?.id === currentRejectId) {
        setDrawerVisible(false);
      }
      fetchRegistrations();
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Lỗi khi từ chối');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = () => {
    if (!selectedReg) return;
    editForm.setFieldsValue({
      teamName: selectedReg.teamName,
      teamLogo: (selectedReg as any).teamLogo, // Since interface Registration doesn't have teamLogo but DB has
      members: selectedReg.members.map(m => ({ memberName: m.memberName, gameId: m.gameId }))
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!selectedReg) return;

      setActionLoading(true);
      await updateRegistrationInfo(selectedReg.id, values);
      message.success('Cập nhật thông tin đội thành công');

      setEditModalVisible(false);
      setDrawerVisible(false);
      fetchRegistrations();
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.message || 'Lỗi khi cập nhật thông tin');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await exportRegistrationsExcel({
        tournamentId,
        status: statusFilter,
      });

      // Tạo url để download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Registrations_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Lỗi khi xuất file Excel');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Registration> = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: 'Tên Team',
      dataIndex: 'teamName',
      key: 'teamName',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Giải đấu',
      key: 'tournament',
      render: (_, record) => record.tournament?.name,
    },
    {
      title: 'Game',
      key: 'game',
      render: (_, record) => {
        const game = record.tournament?.game;
        return <Tag color={GAME_COLORS[game] || 'default'}>{game}</Tag>;
      },
    },
    {
      title: 'Username',
      key: 'username',
      render: (_, record) => record.user?.username,
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, record) => record.user?.email,
    },
    {
      title: 'Thành viên',
      key: 'membersCount',
      align: 'center',
      render: (_, record) => record.members?.length || 0,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (record.status !== 'PENDING') return null;
        return (
          <Space>
            <Popconfirm
              title="Duyệt đăng ký này?"
              onConfirm={(e) => handleApprove(record.id, e as any)}
              onCancel={(e) => e?.stopPropagation()}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Button type="primary" size="small" onClick={(e) => e.stopPropagation()}>
                Duyệt
              </Button>
            </Popconfirm>
            <Button
              danger
              size="small"
              onClick={(e) => openRejectModal(record.id, e)}
            >
              Từ chối
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="Quản lý đăng ký"
      extra={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
          loading={loading}
        >
          Xuất Excel
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} size={8}>
        <Select
          placeholder="Tất cả giải đấu"
          allowClear
          style={{ width: 240 }}
          onChange={(value) => {
            setTournamentId(value);
            setPage(1);
          }}
          options={tournaments.map((t) => ({ label: t.name, value: t.id }))}
        />
        <Select
          placeholder="Tất cả trạng thái"
          allowClear
          style={{ width: 160 }}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          options={[
            { label: 'PENDING', value: 'PENDING' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'REJECTED', value: 'REJECTED' },
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
        onRow={(record) => ({
          onClick: () => {
            setSelectedReg(record);
            setDrawerVisible(true);
          },
          style: { cursor: 'pointer' },
        })}
      />

      {/* Drawer Xem Chi Tiết */}
      <Drawer
        title={`Chi tiết đội: ${selectedReg?.teamName || ''}`}
        width={480}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={openEditModal}
          >
            Chỉnh sửa
          </Button>
        }
        footer={
          selectedReg?.status === 'PENDING' && (
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button danger onClick={() => openRejectModal(selectedReg.id)}>
                Từ chối
              </Button>
              <Button type="primary" onClick={() => handleApprove(selectedReg.id)} loading={actionLoading}>
                Duyệt
              </Button>
            </Space>
          )
        }
      >
        {selectedReg && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Typography.Title level={5}>Trạng thái</Typography.Title>
              <Tag color={STATUS_COLORS[selectedReg.status]}>{selectedReg.status}</Tag>
              {selectedReg.status === 'REJECTED' && selectedReg.note && (
                <div style={{ marginTop: 8, color: 'red' }}>
                  <strong>Lý do từ chối: </strong>
                  {selectedReg.note}
                </div>
              )}
            </div>

            <div>
              <Typography.Title level={5}>Thông tin giải đấu</Typography.Title>
              <p><strong>Tên giải:</strong> {selectedReg.tournament?.name}</p>
              <p>
                <strong>Game:</strong> <Tag color={GAME_COLORS[selectedReg.tournament?.game] || 'default'}>{selectedReg.tournament?.game}</Tag>
              </p>
              <p><strong>Ngày nộp đơn:</strong> {dayjs(selectedReg.createdAt).format('DD/MM/YYYY HH:mm')}</p>
            </div>

            <div>
              <Typography.Title level={5}>Thông tin người đại diện (Người đăng ký)</Typography.Title>
              <p><strong>Username:</strong> {selectedReg.user?.username}</p>
              <p><strong>Email:</strong> {selectedReg.user?.email}</p>
            </div>

            <div>
              <Typography.Title level={5}>Danh sách thành viên ({selectedReg.members?.length || 0})</Typography.Title>
              <List
                itemLayout="horizontal"
                dataSource={selectedReg.members}
                renderItem={(member, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{index + 1}</Avatar>}
                      title={member.memberName}
                      description={`In-game ID: ${member.gameId}`}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Space>
        )}
      </Drawer>

      {/* Modal Nhập Lý Do Từ Chối */}
      <Modal
        title="Lý do từ chối"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleRejectSubmit}
        confirmLoading={actionLoading}
        destroyOnClose
      >
        <Form form={rejectForm} layout="vertical" preserve={false}>
          <Form.Item
            name="note"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa Thông Tin Đội */}
      <Modal
        title="Chỉnh sửa thông tin đội"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        confirmLoading={actionLoading}
        width={600}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" preserve={false}>
          <Form.Item
            name="teamName"
            label="Tên đội"
            rules={[{ required: true, message: 'Vui lòng nhập tên đội' }]}
          >
            <Input placeholder="Nhập tên đội..." />
          </Form.Item>

          <Form.Item
            name="teamLogo"
            label="URL Logo đội (tùy chọn)"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Typography.Title level={5}>Danh sách thành viên</Typography.Title>
          <Form.List name="members">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'memberName']}
                      rules={[{ required: true, message: 'Thiếu tên' }]}
                    >
                      <Input placeholder="Tên thành viên" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'gameId']}
                      rules={[{ required: true, message: 'Thiếu ID' }]}
                    >
                      <Input placeholder="In-game ID" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm thành viên
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Card>
  );
}
