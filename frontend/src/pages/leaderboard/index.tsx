import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Select, Card, Spin, Typography, Modal, Upload, Button, message } from 'antd';
import { TrophyOutlined, UploadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { getAllTournaments, getTournamentById } from '@/services/tournament.service';
import { getMatchesByTournament, uploadMatchEvidence } from '@/services/schedule.service';
import { Table } from 'antd';
import PageTransition from '@/components/motion/PageTransition';
import { useModel } from '@umijs/max';
import './leaderboard.css';

const { Title, Text } = Typography;

// Thứ tự vòng đấu cố định
const ROUND_ORDER = ['Vòng Bảng', 'Tứ Kết', 'Bán Kết', 'Chung Kết'];

interface Team {
  id: string;
  teamName: string;
  teamLogo?: string;
  userId?: string;
}

interface Match {
  id: string;
  team1: Team | null;
  team2: Team | null;
  team1Score: number | null;
  team2Score: number | null;
  status: 'PENDING' | 'ONGOING' | 'COMPLETED';
  round: string;
  startTime?: string;
  evidenceImage?: string;
}

/** Xác định đội thắng */
const getWinnerId = (match: Match): string | null => {
  if (match.status !== 'COMPLETED') return null;
  if (match.team1Score == null || match.team2Score == null) return null;
  if (match.team1Score > match.team2Score) return match.team1?.id ?? null;
  if (match.team2Score > match.team1Score) return match.team2?.id ?? null;
  return null;
};

// ── Match Card ──────────────────────────────────────────────
const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const winnerId = getWinnerId(match);
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [evidenceBase64, setEvidenceBase64] = useState<string | null>(match.evidenceImage || null);

  const isTeam1Owner = currentUser && match.team1?.userId === currentUser.id;
  const isTeam2Owner = currentUser && match.team2?.userId === currentUser.id;
  const canUpload = (isTeam1Owner || isTeam2Owner) && match.status === 'ONGOING';

  const handleCardClick = () => {
    if (canUpload) {  
      setIsModalVisible(true);
    }
  };

  const handleUpload = async () => {
    if (!evidenceBase64) {
      message.error('Vui lòng chọn ảnh minh chứng!');
      return;
    }
    setUploading(true);
    try {
      await uploadMatchEvidence(match.id, evidenceBase64);
      message.success('Tải lên minh chứng thành công!');
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải lên minh chứng');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được tải lên tệp hình ảnh!');
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setEvidenceBase64(reader.result as string);
    return false; // Ngăn auto upload
  };

  const TeamRow: React.FC<{ team: Team | null; score: number | null }> = ({ team, score }) => {
    const isWinner = !!winnerId && winnerId === team?.id;
    const isLoser = !!winnerId && !!team && winnerId !== team.id;
    return (
      <div className={`bracket-team-row ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
        {isWinner && <TrophyOutlined style={{ color: '#52c41a', fontSize: 10, flexShrink: 0 }} />}
        <span className="bracket-team-name">{team?.teamName ?? 'TBD'}</span>
        <span className="bracket-team-score">{score != null ? score : '-'}</span>
      </div>
    );
  };

  return (
    <>
      <motion.div
        className={`bracket-match-card ${match.status === 'ONGOING' ? 'ongoing' : ''} ${canUpload ? 'clickable' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleCardClick}
        style={canUpload ? { cursor: 'pointer' } : {}}
      >
      {match.status === 'ONGOING' && <div className="bracket-live-badge">● LIVE</div>}
      <TeamRow team={match.team1} score={match.team1Score} />
      <div className="bracket-match-divider" />
        <TeamRow team={match.team2} score={match.team2Score} />
      </motion.div>

      <Modal
        title="Tải lên minh chứng kết quả trận đấu"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" loading={uploading} onClick={handleUpload}>
            Gửi minh chứng
          </Button>,
        ]}
      >
        <Typography.Paragraph>
          Vui lòng tải lên ảnh chụp màn hình kết quả trận đấu để làm minh chứng. Chỉ gửi khi trận đấu đã kết thúc.
        </Typography.Paragraph>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
        {evidenceBase64 && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <img src={evidenceBase64} alt="Minh chứng" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8, border: '1px solid #d9d9d9' }} />
          </div>
        )}
      </Modal>
    </>
  );
};

// ── Champion Box ────────────────────────────────────────────
const ChampionBox: React.FC<{ match: Match; roundIdx?: number }> = ({ match, roundIdx = 2 }) => {
  const winnerId = getWinnerId(match);
  const champion =
    winnerId === match.team1?.id ? match.team1 :
      winnerId === match.team2?.id ? match.team2 : null;

  if (!champion) return null;

  let championTop = 0;
  if (roundIdx === 1) championTop = 46;
  if (roundIdx === 2) championTop = 146;
  if (roundIdx === 3) championTop = 346;

  // Căn giữa hộp cúp với tâm của thẻ trận đấu cuối cùng
  const marginTop = Math.max(0, championTop - 32);

  return (
    <motion.div
      className="bracket-champion-col"
      style={{ marginTop }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.4 }}
    >
      <div className="bracket-champion-box">
        <div className="bracket-champion-trophy">🏆</div>
        <div className="bracket-champion-label">Vô địch</div>
        {champion.teamLogo && (
          <img 
            src={champion.teamLogo} 
            alt="Team Logo" 
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%', marginBottom: 12, border: '2px solid #faad14' }} 
          />
        )}
        <div className="bracket-champion-name">{champion.teamName}</div>
      </div>
    </motion.div>
  );
};

// ── Bracket View ────────────────────────────────────────────
const BracketView: React.FC<{ matches: Match[] }> = ({ matches }) => {
  // Nhóm matches theo round, chỉ lấy các round có trong ROUND_ORDER
  const grouped: Record<string, Match[]> = {};
  for (const m of matches) {
    if (ROUND_ORDER.includes(m.round)) {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    }
  }

  const rounds = ROUND_ORDER.filter((r) => grouped[r]?.length > 0).map((r) => ({
    name: r,
    matches: grouped[r],
  }));

  if (rounds.length === 0) {
    return <div className="bracket-empty"><Text type="secondary">Chưa có trận đấu nào.</Text></div>;
  }

  // Chỉ hiện champion khi vòng "Chung Kết" hoàn thành
  const finalRound = rounds.find((r) => r.name === 'Chung Kết');
  const finalMatch = finalRound?.matches[0];

  return (
    <div className="bracket-container">
      <div className="bracket-rounds">
        {rounds.map((round, roundIdx) => {
          // Group matches thành từng cặp 2 trận
          const pairs: Match[][] = [];
          for (let i = 0; i < round.matches.length; i += 2) {
            pairs.push(round.matches.slice(i, i + 2));
          }

          const isLast = roundIdx === rounds.length - 1;

          // Tính toán gap, margin và độ lệch top để các nhánh cây (connector) khớp nhau
          let currentGap = 16;
          let currentMargin = 32;
          let currentTop = 0;

          if (roundIdx === 1) {
            currentGap = 124; currentMargin = 124; currentTop = 46;
          } else if (roundIdx === 2) {
            currentGap = 324; currentMargin = 324; currentTop = 146;
          } else if (roundIdx === 3) {
            currentGap = 724; currentMargin = 724; currentTop = 346;
          }

          return (
            <React.Fragment key={round.name}>
              {/* Round column */}
              <div
                className="bracket-round-col"
                style={{ '--pair-gap': `${currentGap}px` } as React.CSSProperties}
              >
                <div className="bracket-round-label">{round.name}</div>
                <div className="bracket-round-matches" style={{ paddingTop: currentTop }}>
                  {pairs.map((pair, pairIdx) => (
                    <div
                      key={pairIdx}
                      className={pair.length === 2 && !isLast ? 'bracket-pair' : ''}
                      style={{ marginBottom: pairIdx < pairs.length - 1 ? currentMargin : 0 }}
                    >
                      {pair.map((match) => (
                        <div
                          key={match.id}
                          className={pair.length === 2 && !isLast ? 'bracket-match-slot' : ''}
                        >
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector spacer between rounds */}
              {!isLast && <div className="bracket-connector-col" />}
            </React.Fragment>
          );
        })}

        {/* Champion display nếu chung kết xong */}
        {finalMatch && getWinnerId(finalMatch) && (
          <ChampionBox match={finalMatch} roundIdx={rounds.length - 1} />
        )}
      </div>
    </div>
  );
};

// ── Survival Stage Leaderboard ──────────────────────────────
const SurvivalStageLeaderboard: React.FC<{ teams: any[] }> = ({ teams }) => {
  const sortedTeams = [...teams].sort((a, b) => {
    const pointsDiff = (b.survivalPoints || 0) - (a.survivalPoints || 0);
    if (pointsDiff !== 0) return pointsDiff;
    const top1Diff = (b.top1Count || 0) - (a.top1Count || 0);
    if (top1Diff !== 0) return top1Diff;
    return (b.kills || 0) - (a.kills || 0);
  });

  return (
    <motion.div
      className="survival-leaderboard"
      style={{ padding: '0 20px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Table
        className="premium-table"
        dataSource={sortedTeams}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: 'HẠNG',
            render: (_, __, i) => {
              const rank = i + 1;
              let rankStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.45)', fontWeight: 'bold', fontSize: 16 };
              let icon = null;

              if (rank === 1) {
                rankStyle.color = '#ffd700';
                icon = <TrophyOutlined style={{ color: '#ffd700', marginRight: 8, fontSize: 18 }} />;
              } else if (rank === 2) {
                rankStyle.color = '#e0e0e0';
              } else if (rank === 3) {
                rankStyle.color = '#cd7f32';
              }

              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...rankStyle }}>
                  {icon}
                  {rank === 1 ? '1' : rank}
                </div>
              );
            },
            width: 80,
            align: 'center',
            key: 'stt'
          },
          {
            title: 'ĐỘI TUYỂN',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text, _, i) => (
              <Text strong style={{
                color: i === 0 ? '#ffd700' : '#fff',
                fontSize: 16,
                textShadow: i === 0 ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
              }}>
                {text}
              </Text>
            )
          },
          {
            title: 'TOP 1',
            dataIndex: 'top1Count',
            key: 'top1Count',
            align: 'center',
            render: (val) => <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{val || 0}</Text>
          },
          {
            title: 'KILLS',
            dataIndex: 'kills',
            key: 'kills',
            align: 'center',
            render: (val) => <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15 }}>{val || 0}</Text>
          },
          {
            title: 'TỔNG ĐIỂM',
            dataIndex: 'survivalPoints',
            key: 'survivalPoints',
            align: 'center',
            render: (val, _, i) => (
              <Text strong style={{
                color: i === 0 ? '#ffd700' : '#faad14',
                fontSize: i === 0 ? 20 : 18,
                textShadow: i === 0 ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
              }}>
                {val || 0}
              </Text>
            )
          },
        ]}
      />
    </motion.div>
  );
};

// ── Round Robin Leaderboard ──────────────────────────────
const RoundRobinLeaderboard: React.FC<{ matches: Match[], teams: any[] }> = ({ matches, teams }) => {
  const stats: Record<string, any> = {};

  teams.forEach(t => {
    stats[t.id] = {
      id: t.id,
      teamName: t.teamName,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      goalDifference: 0
    };
  });

  matches.filter(m => m.status === 'COMPLETED').forEach(m => {
    const t1 = m.team1?.id;
    const t2 = m.team2?.id;
    const s1 = m.team1Score ?? 0;
    const s2 = m.team2Score ?? 0;

    if (t1 && stats[t1]) {
      stats[t1].matchesPlayed += 1;
      stats[t1].goalsFor += s1;
      stats[t1].goalsAgainst += s2;
      if (s1 > s2) { stats[t1].wins += 1; stats[t1].points += 3; }
      else if (s1 === s2) { stats[t1].draws += 1; stats[t1].points += 1; }
      else { stats[t1].losses += 1; }
      stats[t1].goalDifference = stats[t1].goalsFor - stats[t1].goalsAgainst;
    }

    if (t2 && stats[t2]) {
      stats[t2].matchesPlayed += 1;
      stats[t2].goalsFor += s2;
      stats[t2].goalsAgainst += s1;
      if (s2 > s1) { stats[t2].wins += 1; stats[t2].points += 3; }
      else if (s2 === s1) { stats[t2].draws += 1; stats[t2].points += 1; }
      else { stats[t2].losses += 1; }
      stats[t2].goalDifference = stats[t2].goalsFor - stats[t2].goalsAgainst;
    }
  });

  const sortedTeams = Object.values(stats).sort((a: any, b: any) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  return (
    <motion.div
      className="survival-leaderboard"
      style={{ padding: '0 20px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Table
        className="premium-table"
        dataSource={sortedTeams}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: 'HẠNG',
            render: (_, __, i) => {
              const rank = i + 1;
              let rankStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.45)', fontWeight: 'bold', fontSize: 16 };
              let icon = null;
              if (rank === 1) { rankStyle.color = '#ffd700'; icon = <TrophyOutlined style={{ color: '#ffd700', marginRight: 8, fontSize: 18 }} />; } 
              else if (rank === 2) { rankStyle.color = '#e0e0e0'; } 
              else if (rank === 3) { rankStyle.color = '#cd7f32'; }
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...rankStyle }}>
                  {icon}
                  {rank}
                </div>
              );
            },
            width: 80,
            align: 'center',
            key: 'stt'
          },
          {
            title: 'ĐỘI TUYỂN',
            dataIndex: 'teamName',
            key: 'teamName',
            render: (text, _, i) => (
              <Text strong style={{ color: i === 0 ? '#ffd700' : '#fff', fontSize: 16 }}>{text}</Text>
            )
          },
          { title: 'TRẬN', dataIndex: 'matchesPlayed', key: 'matchesPlayed', align: 'center', render: (v) => <Text style={{ color: '#fff' }}>{v}</Text> },
          { title: 'THẮNG', dataIndex: 'wins', key: 'wins', align: 'center', render: (v) => <Text style={{ color: '#52c41a' }}>{v}</Text> },
          { title: 'HÒA', dataIndex: 'draws', key: 'draws', align: 'center', render: (v) => <Text style={{ color: '#faad14' }}>{v}</Text> },
          { title: 'THUA', dataIndex: 'losses', key: 'losses', align: 'center', render: (v) => <Text style={{ color: '#ff4d4f' }}>{v}</Text> },
          { title: 'HỆ SỐ', dataIndex: 'goalDifference', key: 'goalDifference', align: 'center', render: (v) => <Text style={{ color: '#fff' }}>{v > 0 ? `+${v}` : v}</Text> },
          { title: 'ĐIỂM', dataIndex: 'points', key: 'points', align: 'center', render: (v, _, i) => <Text strong style={{ color: i === 0 ? '#ffd700' : '#faad14', fontSize: 18 }}>{v}</Text> },
        ]}
      />
    </motion.div>
  );
};

// ── Main Page ───────────────────────────────────────────────
const LeaderboardPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [approvedTeams, setApprovedTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    setLoadingTournaments(true);
    getAllTournaments()
      .then((res) => {
        const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setTournaments(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .catch(console.error)
      .finally(() => setLoadingTournaments(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingMatches(true);
    Promise.all([
      getMatchesByTournament(selectedId),
      getTournamentById(selectedId)
    ])
      .then(([matchesRes, tournament]) => {
        setMatches(matchesRes.success ? matchesRes.data : []);
        setSelectedTournament(tournament);
        setApprovedTeams(tournament?.registrations || []);
      })
      .catch(console.error)
      .finally(() => setLoadingMatches(false));
  }, [selectedId]);

  return (
    <PageContainer title={false}>
      <PageTransition>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, color: '#fff' }}>
            <TrophyOutlined style={{ color: '#faad14', marginRight: 10 }} />
            {selectedTournament?.format === 'SURVIVAL_STAGE' ? 'Bảng Xếp Hạng Sinh Tồn' : selectedTournament?.format === 'ROUND_ROBIN' ? 'Bảng Xếp Hạng' : 'Bảng Nhánh Đấu'}
          </Title>
          <Select
            style={{ width: 280 }}
            placeholder="Chọn giải đấu..."
            loading={loadingTournaments}
            value={selectedId}
            onChange={setSelectedId}
            options={tournaments.map((t) => ({ value: t.id, label: t.name }))}
          />
        </div>

        {/* Bracket */}
        <Card
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            minHeight: 300,
          }}
          bodyStyle={{ padding: 32 }}
        >
          {loadingMatches ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : selectedTournament?.format === 'SURVIVAL_STAGE' ? (
            <SurvivalStageLeaderboard teams={approvedTeams} />
          ) : selectedTournament?.format === 'ROUND_ROBIN' ? (
            <RoundRobinLeaderboard matches={matches} teams={approvedTeams} />
          ) : (
            <BracketView matches={matches} />
          )}
        </Card>
      </PageTransition>
    </PageContainer>
  );
};

export default LeaderboardPage;
