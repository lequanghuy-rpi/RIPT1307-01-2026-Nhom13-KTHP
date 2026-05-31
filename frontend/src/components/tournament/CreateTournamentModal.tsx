import {
  Modal,
  Form,
  Input,
  Select,
  Button,
} from "antd";

interface Props {
  open: boolean;

  onClose: () => void;

  onCreate: (
    values: any
  ) => void;

  loading?: boolean;
}

export default function CreateTournamentModal({
  open,
  onClose,
  onCreate,
  loading,
}: Props) {
  const [form] =
    Form.useForm();

  const handleSubmit =
    async () => {
      try {
        const values =
          await form.validateFields();

        await onCreate(values);

        form.resetFields();
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <Modal
      open={open}
      title="Tạo giải đấu"
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
          Tạo giải đấu
        </Button>
      </Form>
    </Modal>
  );
}