import {
  Card,
  List,
  Tag,
} from "antd";

interface Props {
  matches: any[];
}

export default function TournamentMatches({
  matches,
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
    <Card
      title="Lịch thi đấu"
      style={{ marginTop: 24 }}
    >
      <List
        dataSource={matches}
        renderItem={(match) => (
          <List.Item>
            <div>
              <h3>
                {match.teamA} vs{" "}
                {match.teamB}
              </h3>

              <p>{match.time}</p>
            </div>

            <Tag
              color={getStatusColor(
                match.status
              )}
            >
              {match.status}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
}