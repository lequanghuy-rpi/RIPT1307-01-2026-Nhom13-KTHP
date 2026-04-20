import { Request, Response } from 'express';
import * as matchService from '../services/match.service';

export const getMatchesByTournament = async (req: Request, res: Response) => {
  try {
    const tournamentId = req.params.tournamentId as string;
    const matches = await matchService.getMatchesByTournament(tournamentId);
    res.json({ success: true, data: matches });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch thi đấu', error: error.message });
  }
};

export const createMatch = async (req: Request, res: Response) => {
  try {
    // Requires Admin access (should be enforced by middleware)
    const { tournamentId, team1Id, team2Id, round, startTime } = req.body;
    
    if (!tournamentId || !team1Id || !team2Id) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (tournamentId, team1Id, team2Id)' });
    }

    const match = await matchService.createMatch({ tournamentId, team1Id, team2Id, round, startTime });
    res.status(201).json({ success: true, data: match, message: 'Tạo trận đấu thành công' });
  } catch (error: any) {
    console.error('Error creating match:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo trận đấu', error: error.message });
  }
};

export const updateMatchScore = async (req: Request, res: Response) => {
  try {
    // Requires Admin access
    const id = req.params.id as string;
    const { team1Score, team2Score, status } = req.body;

    const match = await matchService.updateMatchScore(id, { team1Score, team2Score, status });
    res.json({ success: true, data: match, message: 'Cập nhật trận đấu thành công' });
  } catch (error: any) {
    console.error('Error updating match:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật trận đấu', error: error.message });
  }
};

export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await matchService.deleteMatch(id);
    res.json({ success: true, message: 'Xóa trận đấu thành công' });
  } catch (error: any) {
    console.error('Error deleting match:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa trận đấu', error: error.message });
  }
};

export const uploadEvidence = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { evidenceImage } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Chưa xác thực' });
    }

    if (!evidenceImage) {
      return res.status(400).json({ success: false, message: 'Thiếu hình ảnh minh chứng' });
    }

    const match = await matchService.uploadEvidence(id, req.user.id, evidenceImage);
    res.json({ success: true, data: match, message: 'Tải lên minh chứng thành công' });
  } catch (error: any) {
    console.error('Error uploading evidence:', error);
    res.status(400).json({ success: false, message: error.message || 'Lỗi khi tải lên minh chứng' });
  }
};
