import {
  Card,
  Col,
  Row,
  Statistic,
} from "antd";

import {
  TrophyOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

interface Props {
  tournaments: any[];
}

export default function TournamentStats({
  tournaments,
}: Props) {
  const total =
    tournaments.length;

  const ongoing =
    tournaments.filter(
      (item) =>
        item.status ===
        "ONGOING"
    ).length;

  const upcoming =
    tournaments.filter(
      (item) =>
        item.status ===
        "UPCOMING"
    ).length;

  const finished =
    tournaments.filter(
      (item) =>
        item.status ===
        "FINISHED"
    ).length;

  return (
    <Row
      gutter={[16, 16]}
      style={{
        marginBottom: 24,
      }}
    >
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng giải đấu"
            value={total}
            prefix={
              <TrophyOutlined />
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Đang diễn ra"
            value={ongoing}
            prefix={
              <PlayCircleOutlined />
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Sắp diễn ra"
            value={upcoming}
            prefix={
              <ClockCircleOutlined />
            }
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Đã kết thúc"
            value={finished}
            prefix={
              <CheckCircleOutlined />
            }
          />
        </Card>
      </Col>
    </Row>
  );
}