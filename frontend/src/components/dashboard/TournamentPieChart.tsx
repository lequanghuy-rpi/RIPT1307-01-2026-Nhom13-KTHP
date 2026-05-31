import { Card } from "antd";

import {
  Pie,
} from "@ant-design/plots";

interface Props {
  tournaments: any[];
}

export default function TournamentPieChart({
  tournaments,
}: Props) {
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

  const data = [
    {
      type: "Đang diễn ra",
      value: ongoing,
    },

    {
      type: "Sắp diễn ra",
      value: upcoming,
    },

    {
      type: "Đã kết thúc",
      value: finished,
    },
  ];

  const config: any = {
    data,

    angleField: "value",

    colorField: "type",

    radius: 0.8,

    label: {
      type: "outer",
    },

    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <Card
      title="Thống kê trạng thái giải đấu"
      style={{
        marginBottom: 24,
      }}
    >
      <Pie {...config} />
    </Card>
  );
}