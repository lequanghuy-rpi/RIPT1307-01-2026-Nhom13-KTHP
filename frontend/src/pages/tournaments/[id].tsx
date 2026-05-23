import {
  Card,
  Col,
  Row,
  Spin,
} from "antd";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import TournamentBanner from "@/components/tournament/TournamentBanner";

import TournamentSidebar from "@/components/tournament/TournamentSidebar";

import RegisterModal from "@/components/tournament/RegisterModal";

import TournamentTeams from "@/components/tournament/TournamentTeams";

import { getTournamentById, getMyRegistrations } from "@/services/tournament.service";

import TournamentMatches from "@/components/tournament/TournamentMatches";

export default function TournamentDetail() {
  const params = useParams();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [tournament, setTournament] =
    useState<any>(null);

  const [isRegistered, setIsRegistered] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchTournament =
    async () => {
      try {
        setLoading(true);

        const data =
          await getTournamentById(
            params.id || ""
          );

        setTournament(data);

        if (user && user.role === 'USER') {
          const myRegs = await getMyRegistrations();
          const registered = myRegs.some((reg: any) => reg.tournamentId === params.id);
          setIsRegistered(registered);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleRegisterSuccess = () => {
    setIsRegistered(true);
    fetchTournament(); // Refresh tournament data (like approved count if needed)
  };

  useEffect(() => {
    fetchTournament();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 100,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const approvedTeams = tournament?.registrations?.map((reg: any) => ({
    id: reg.id,
    name: reg.teamName,
    captain: reg.user?.username || "N/A",
    rank: "Unranked",
    logo: reg.teamLogo || "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
  })) || [];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <TournamentBanner
              tournament={tournament}
            />
          </Card>

          <TournamentTeams
            teams={approvedTeams}
          />
        </Col>

        <Col xs={24} lg={8}>
          <TournamentSidebar
            tournament={tournament}
            onRegister={() => setOpen(true)}
            user={user}
            isRegistered={isRegistered}
            onUpdated={fetchTournament}
          />
        </Col>
      </Row>

      <RegisterModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        tournamentId={params.id || ""}
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
}