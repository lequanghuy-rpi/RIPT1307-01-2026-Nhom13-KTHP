import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

import { registerTournament } from "@/services/tournament.service";

interface Props {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  onSuccess?: () => void;
}

export default function RegisterModal({
  open,
  onClose,
  tournamentId,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const values =
        await form.validateFields();

      if (!values.members || values.members.length === 0) {
        message.error("Vui lòng thêm ít nhất 1 thành viên!");
        return;
      }

      if (values.members.length > 5) {
        message.error("Chỉ được đăng ký tối đa 5 thành viên!");
        return;
      }

      const payload = {
        tournamentId,
        teamName: values.teamName,
        teamLogo: values.teamLogo,
        members: values.members,
      };

      const response =
        await registerTournament(payload);

      message.success(response.message);

      form.resetFields();

      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.log(error);

      message.error(
        error.response?.data?.message || "Đăng ký thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đăng ký giải đấu"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          label="Tên đội"
          name="teamName"
          rules={[
            {
              required: true,
              message: "Nhập tên đội",
            },
          ]}
        >
          <Input placeholder="Nhập tên đội" />
        </Form.Item>

        <Form.Item
          label="Ảnh đội (URL)"
          name="teamLogo"
        >
          <Input placeholder="Nhập link ảnh đội của bạn" />
        </Form.Item>

        <Form.List 
          name="members"
          rules={[
            {
              validator: async (_, members) => {
                if (!members || members.length < 1) {
                  return Promise.reject(new Error('Vui lòng thêm ít nhất 1 thành viên'));
                }
                if (members.length > 5) {
                  return Promise.reject(new Error('Tối đa 5 thành viên'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'memberName']}
                    rules={[{ required: true, message: 'Nhập tên thành viên' }]}
                  >
                    <Input placeholder="Tên thành viên" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'gameId']}
                    rules={[{ required: true, message: 'Nhập in-game ID' }]}
                  >
                    <Input placeholder="In-game ID" />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  ) : null}
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm thành viên
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleSubmit}
        >
          Xác nhận đăng ký
        </Button>
      </Form>
    </Modal>
  );
}