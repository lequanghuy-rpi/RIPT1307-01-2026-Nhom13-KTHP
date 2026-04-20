"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadEvidence = exports.deleteMatch = exports.updateMatchScore = exports.createMatch = exports.getMatchesByTournament = void 0;
const matchService = __importStar(require("../services/match.service"));
const getMatchesByTournament = async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const matches = await matchService.getMatchesByTournament(tournamentId);
        res.json({ success: true, data: matches });
    }
    catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch thi đấu', error: error.message });
    }
};
exports.getMatchesByTournament = getMatchesByTournament;
const createMatch = async (req, res) => {
    try {
        // Requires Admin access (should be enforced by middleware)
        const { tournamentId, team1Id, team2Id, round, startTime } = req.body;
        if (!tournamentId || !team1Id || !team2Id) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (tournamentId, team1Id, team2Id)' });
        }
        const match = await matchService.createMatch({ tournamentId, team1Id, team2Id, round, startTime });
        res.status(201).json({ success: true, data: match, message: 'Tạo trận đấu thành công' });
    }
    catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tạo trận đấu', error: error.message });
    }
};
exports.createMatch = createMatch;
const updateMatchScore = async (req, res) => {
    try {
        // Requires Admin access
        const id = req.params.id;
        const { team1Score, team2Score, status } = req.body;
        const match = await matchService.updateMatchScore(id, { team1Score, team2Score, status });
        res.json({ success: true, data: match, message: 'Cập nhật trận đấu thành công' });
    }
    catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trận đấu', error: error.message });
    }
};
exports.updateMatchScore = updateMatchScore;
const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id;
        await matchService.deleteMatch(id);
        res.json({ success: true, message: 'Xóa trận đấu thành công' });
    }
    catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xóa trận đấu', error: error.message });
    }
};
exports.deleteMatch = deleteMatch;
const uploadEvidence = async (req, res) => {
    try {
        const id = req.params.id;
        const { evidenceImage } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Chưa xác thực' });
        }
        if (!evidenceImage) {
            return res.status(400).json({ success: false, message: 'Thiếu hình ảnh minh chứng' });
        }
        const match = await matchService.uploadEvidence(id, req.user.id, evidenceImage);
        res.json({ success: true, data: match, message: 'Tải lên minh chứng thành công' });
    }
    catch (error) {
        console.error('Error uploading evidence:', error);
        res.status(400).json({ success: false, message: error.message || 'Lỗi khi tải lên minh chứng' });
    }
};
exports.uploadEvidence = uploadEvidence;
//# sourceMappingURL=match.controller.js.map