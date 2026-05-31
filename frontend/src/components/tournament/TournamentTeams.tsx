import {
  Card,
  List,
  Avatar,
  Tag,
} from "antd";

interface Props {
  teams: any[];
}

export default function TournamentTeams({
  teams,
}: Props) {
  return (
    <Card
      title="Danh sách đội tham gia"
      style={{ marginTop: 24 }}
    >
      <List
        itemLayout="horizontal"
        dataSource={teams}
        renderItem={(team) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={team.logo} />
              }
              title={team.name}
              description={`Captain: ${team.captain}`}
            />

            <Tag color="gold">
              {team.rank}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
}