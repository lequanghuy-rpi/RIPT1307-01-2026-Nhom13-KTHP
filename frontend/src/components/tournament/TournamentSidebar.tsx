import React, { useState } from 'react';
import {
  Card,
  Progress,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Space,
  message,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { updateTournament, deleteTournament } from '@/services/adminTournament.service';
import { history } from '@umijs/max';

interface Props {
  tournament: any;
  onRegister: () => void;
  user?: any;
  isRegistered?: boolean;
  onUpdated?: () => void; // callback để reload tournament sau khi sửa
}

export default function TournamentSidebar({
  tournament,
  onRegister,
  user,
  isRegistered,
  onUpdated,
}: Props) {
  const currentTeams = tournament._count?.registrations || tournament.currentTeams || 0;
  const percent = (currentTeams / tournament.maxTeams) * 100;

  const isAdmin = user?.role === 'ADMIN';
  const showRegisterButton =
    user &&
    user.role === 'USER' &&
    tournament.status === 'UPCOMING' &&
    !isRegistered;

  // ── Edit modal ──────────────────────────────────
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const openEdit = () => {
    form.setFieldsValue({
      name: tournament.name,
      game: tournament.game,
      banner: tournament.banner,
      startDate: tournament.startDate ? dayjs(tournament.startDate) : undefined,
      endDate: tournament.endDate ? dayjs(tournament.endDate) : undefined,
      maxTeams: tournament.maxTeams,
      prizePool: tournament.prizePool,
      status: tournament.status,
      format: tournament.format || 'SINGLE_ELIMINATION',
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await updateTournament(tournament.id, {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      });
      message.success('Cập nhật giải đấu thành công!');
      setEditOpen(false);
      onUpdated?.();
    } catch (err: any) {
      if (err?.response) {
        message.error(err.response.data?.message || 'Có lỗi xảy ra');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTournament = async () => {
    try {
      await deleteTournament(tournament.id);
      message.success('Xóa giải đấu thành công!');
      history.push('/admin/tournaments'); // Về trang quản lý admin
    } catch (err: any) {
      if (err?.response) {
        message.error(err.response.data?.message || 'Có lỗi xảy ra khi xóa giải đấu');
      }
    }
  };

  return (
    <>
      <Card
        title="Thông tin giải đấu"
        extra={
          isAdmin && (
            <Space>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={openEdit}
                style={{ color: '#1890ff' }}
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc muốn xóa giải đấu này?"
                onConfirm={handleDeleteTournament}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button type="text" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )
        }
      >
        <p>
          <strong>Số đội được duyệt:</strong>{' '}
          {currentTeams}/{tournament.maxTeams}
        </p>

        <p>
          <strong>Kiểu giải đấu:</strong>{' '}
          {tournament.format === 'ROUND_ROBIN'
            ? '🔄 Vòng bảng (Round Robin)'
            : tournament.format === 'SURVIVAL_STAGE'
            ? '🪂 Sinh tồn (Survival Stage)'
            : '🏆 Nhánh cây (Loại trực tiếp)'}
        </p>

        {tournament.prizePool && (
          <div style={{ marginBottom: 16, padding: 12, background: 'rgba(255, 215, 0, 0.1)', borderRadius: 8, border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <strong style={{ color: '#ffd700', display: 'block', marginBottom: 4 }}>🏆 Cơ cấu giải thưởng:</strong>
            <span style={{ whiteSpace: 'pre-line' }}>{tournament.prizePool}</span>
          </div>
        )}

        <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} />

        {showRegisterButton && (
          <Button
            type="primary"
            size="large"
            block
            style={{ marginTop: 20 }}
            onClick={onRegister}
          >
            Đăng ký tham gia
          </Button>
        )}

        {isRegistered && (
          <Button
            type="default"
            size="large"
            block
            disabled
            style={{ marginTop: 20 }}
          >
            Đã đăng ký tham gia
          </Button>
        )}
      </Card>

      {/* ── Edit Tournament Modal ── */}
      <Modal
        title="Chỉnh sửa giải đấu"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleSave}
        confirmLoading={submitting}
        okText="Lưu thay đổi"
        cancelText="Hủy"
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
                  { label: 'Sắp diễn ra', value: 'UPCOMING' },
                  { label: 'Đang diễn ra', value: 'ONGOING' },
                  { label: 'Đã kết thúc', value: 'FINISHED' },
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
    </>
  );
}