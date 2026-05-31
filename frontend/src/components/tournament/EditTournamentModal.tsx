import {
  Modal,
  Form,
  Input,
  Select,
  Button,
} from "antd";

import {
  useEffect,
} from "react";

interface Props {
  open: boolean;

  onClose: () => void;

  tournament: any;

  onUpdate: (
    values: any
  ) => void;

  loading?: boolean;
}

export default function EditTournamentModal({
  open,
  onClose,
  tournament,
  onUpdate,
  loading,
}: Props) {
  const [form] =
    Form.useForm();

  useEffect(() => {
    if (tournament) {
      form.setFieldsValue({
        name: tournament.name,
        game: tournament.game,
        status: tournament.status,
      });
    }
  }, [tournament]);

  const handleSubmit =
    async () => {
      try {
        const values =
          await form.validateFields();

        await onUpdate(values);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa giải đấu"
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Tên giải đấu"
          name="name"
          rules={[
            {
              required: true,
              message:
                "Vui lòng nhập tên giải đấu",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Game"
          name="game"
          rules={[
            {
              required: true,
              message:
                "Vui lòng nhập tên game",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[
            {
              required: true,
              message:
                "Vui lòng chọn trạng thái",
            },
          ]}
        >
          <Select>
            <Select.Option value="UPCOMING">
              UPCOMING
            </Select.Option>

            <Select.Option value="ONGOING">
              ONGOING
            </Select.Option>

            <Select.Option value="FINISHED">
              FINISHED
            </Select.Option>
          </Select>
        </Form.Item>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleSubmit}
        >
          Cập nhật giải đấu
        </Button>
      </Form>
    </Modal>
  );
}