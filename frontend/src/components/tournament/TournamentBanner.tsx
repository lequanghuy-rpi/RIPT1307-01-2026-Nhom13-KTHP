import {
  Tag,
  Typography,
} from "antd";

const { Title, Paragraph } =
  Typography;

interface Props {
  tournament: any;
}

export default function TournamentBanner({
  tournament,
}: Props) {
  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "UPCOMING":
        return "blue";

      case "ONGOING":
        return "green";

      case "FINISHED":
        return "red";

      default:
        return "default";
    }
  };

  return (
    <>
      <img
        src={tournament.banner}
        alt="banner"
        style={{
          width: "100%",
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <Title level={2}>
        {tournament.name}
      </Title>

      <div style={{ marginBottom: 16 }}>
        <Tag color="purple">
          {tournament.game}
        </Tag>

        <Tag
          color={getStatusColor(
            tournament.status
          )}
        >
          {tournament.status}
        </Tag>
      </div>

      <Paragraph>
        {tournament.description}
      </Paragraph>

      <Paragraph>
        <strong>Giải thưởng:</strong>{" "}
        {tournament.prizePool}
      </Paragraph>
    </>
  );
}