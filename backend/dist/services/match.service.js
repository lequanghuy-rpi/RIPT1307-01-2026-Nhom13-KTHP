"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEvidence = exports.deleteMatch = exports.updateMatchScore = exports.createMatch = exports.getMatchesByTournament = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMatchesByTournament = async (tournamentId) => {
    return await prisma.match.findMany({
        where: { tournamentId },
        include: {
            team1: true,
            team2: true,
        },
        orderBy: { createdAt: 'asc' },
    });
};
exports.getMatchesByTournament = getMatchesByTournament;
const createMatch = async (data) => {
    return await prisma.match.create({
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
};
exports.createMatch = createMatch;
const updateMatchScore = async (id, data) => {
    return await prisma.match.update({
        where: { id },
        data,
        include: {
            team1: true,
            team2: true,
        }
    });
};
exports.updateMatchScore = updateMatchScore;
const deleteMatch = async (id) => {
    return await prisma.match.delete({
        where: { id },
    });
};
exports.deleteMatch = deleteMatch;
const uploadEvidence = async (id, userId, evidenceImage) => {
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
exports.uploadEvidence = uploadEvidence;
//# sourceMappingURL=match.service.js.map