import ExcelJS from "exceljs";
import prisma from "../config/prisma";
import { RegistrationStatus } from "@prisma/client";

export const exportService = {
  async exportRegistrationsToExcel(query: any) {
    const { tournamentId, status } = query;

    const where: any = {};
    if (tournamentId) where.tournamentId = tournamentId;
    if (status) where.status = status as RegistrationStatus;

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        tournament: true,
        members: true,
        user: true,
      },
      orderBy: { createdAt: "desc" }
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Registrations");

    // Columns
    sheet.columns = [
      { header: "STT", key: "stt", width: 5 },
      { header: "Tên Team", key: "teamName", width: 25 },
      { header: "Thành viên", key: "members", width: 40 },
      { header: "Game", key: "game", width: 20 },
      { header: "Giải đấu", key: "tournamentName", width: 30 },
      { header: "Trạng thái", key: "status", width: 15 },
      { header: "Ngày đăng ký", key: "createdAt", width: 20 },
    ];

    // Header styling
    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1890FF" } // #1890ff
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Add rows
    registrations.forEach((reg, index) => {
      const memberNames = reg.members.map(m => m.memberName).join(", ");
      
      const row = sheet.addRow({
        stt: index + 1,
        teamName: reg.teamName,
        members: memberNames,
        game: reg.tournament.game,
        tournamentName: reg.tournament.name,
        status: reg.status,
        createdAt: reg.createdAt.toLocaleDateString("vi-VN"),
      });

      // Status cell styling
      const statusCell = row.getCell("status");
      if (reg.status === "APPROVED") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9F7BE" } }; // #d9f7be
      } else if (reg.status === "REJECTED") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF1F0" } }; // #fff1f0
      } else if (reg.status === "PENDING") {
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF7E6" } }; // #fff7e6
      }
      statusCell.alignment = { horizontal: "center" };
    });

    return workbook;
  }
};
