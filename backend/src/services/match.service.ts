import { PrismaClient } from '@prisma/client';
import { notificationService } from './notification.service';

const prisma = new PrismaClient();

export const getMatchesByTournament = async (tournamentId: string) => {
  return await prisma.match.findMany({
    where: { tournamentId },
    include: {
      team1: true,
      team2: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createMatch = async (data: { tournamentId: string; team1Id: string; team2Id: string; round?: string; startTime?: Date }) => {
  const match = await prisma.match.create({
    data: {
      tournamentId: data.tournamentId,
      team1Id: data.team1Id,
      team2Id: data.team2Id,
      round: data.round,
      startTime: data.startTime ? new Date(data.startTime) : null,
      status: 'PENDING',
    },
    include: {
      team1: true,
      team2: true,
    }
  });

  // Gửi thông báo cho 2 đội
  if (match.team1?.userId) {
    await notificationService.createNotification(
      match.team1.userId,
      "Lịch thi đấu mới",
      `Đội của bạn sẽ đấu với đội ${match.team2?.teamName || 'TBD'} tại ${match.round || 'vòng đấu mới'}.`
    );
  }
  if (match.team2?.userId) {
    await notificationService.createNotification(
      match.team2.userId,
      "Lịch thi đấu mới",
      `Đội của bạn sẽ đấu với đội ${match.team1?.teamName || 'TBD'} tại ${match.round || 'vòng đấu mới'}.`
    );
  }

  return match;
};

export const updateMatchScore = async (id: string, data: { team1Score?: number; team2Score?: number; status?: string }) => {
  const match = await prisma.match.update({
    where: { id },
    data,
    include: {
      team1: true,
      team2: true,
    }
  });

  // Gửi thông báo cho 2 đội khi có thay đổi trạng thái hoặc tỉ số
  const statusStr = match.status === 'ONGOING' ? 'Đang diễn ra' : match.status === 'COMPLETED' ? 'Đã kết thúc' : match.status;
  
  if (match.team1?.userId) {
    await notificationService.createNotification(
      match.team1.userId,
      "Cập nhật trận đấu",
      `Trận đấu giữa ${match.team1.teamName} và ${match.team2?.teamName || 'TBD'} đã được cập nhật trạng thái thành: ${statusStr}.`
    );
  }
  if (match.team2?.userId) {
    await notificationService.createNotification(
      match.team2.userId,
      "Cập nhật trận đấu",
      `Trận đấu giữa ${match.team1?.teamName || 'TBD'} và ${match.team2.teamName} đã được cập nhật trạng thái thành: ${statusStr}.`
    );
  }

  return match;
};

export const deleteMatch = async (id: string) => {
  return await prisma.match.delete({
    where: { id },
  });
};

export const uploadEvidence = async (id: string, userId: string, evidenceImage: string) => {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team1: true,
      team2: true,
    }
  });

  if (!match) {
    throw new Error('Trận đấu không tồn tại');
  }

  if (match.status !== 'ONGOING') {
    throw new Error('Chỉ có thể tải lên minh chứng khi trận đấu đang diễn ra');
  }

  // Check if user is owner of team 1 or team 2
  const isTeam1Owner = match.team1?.userId === userId;
  const isTeam2Owner = match.team2?.userId === userId;

  if (!isTeam1Owner && !isTeam2Owner) {
    throw new Error('Bạn không có quyền tải lên minh chứng cho trận đấu này');
  }

  return await prisma.match.update({
    where: { id },
    data: { evidenceImage },
  });
};
