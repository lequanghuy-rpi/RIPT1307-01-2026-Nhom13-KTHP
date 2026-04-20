import prisma from "../config/prisma";
import { AppError } from "../middlewares/error.middleware";
import { TournamentStatus, RegistrationStatus, TournamentFormat } from "@prisma/client";

interface CreateTournamentDto {
  name: string;
  game: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  maxTeams: number;
  banner?: string;
  format?: TournamentFormat;
  prizePool?: string;
}

interface UpdateTournamentDto extends Partial<CreateTournamentDto> {
  status?: TournamentStatus;
  format?: TournamentFormat;
}

export const tournamentService = {
  async getAllTournaments(query: any) {
    const { game, status, search, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (game) where.game = game;
    if (status) where.status = status as TournamentStatus;
    if (search) {
      where.name = { contains: search };
    }

    const [total, data] = await Promise.all([
      prisma.tournament.count({ where }),
      prisma.tournament.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              registrations: {
                where: { status: "APPROVED" }
              }
            }
          }
        }
      })
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      data
    };
  },

  async getTournamentById(id: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, username: true, email: true, avatar: true }
        },
        _count: {
          select: {
            registrations: {
              where: { status: RegistrationStatus.APPROVED }
            }
          }
        },
        registrations: {
          where: { status: RegistrationStatus.APPROVED },
          include: {
            members: true,
            user: {
              select: {
                username: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!tournament) {
      throw new AppError("Không tìm thấy giải đấu", 404);
    }
    return tournament;
  },

  async createTournament(data: CreateTournamentDto, adminId: string) {
    return prisma.tournament.create({
      data: {
        ...data,
        createdById: adminId,
        status: TournamentStatus.UPCOMING
      }
    });
  },

  async updateTournament(id: string, data: UpdateTournamentDto) {
    const existing = await prisma.tournament.findUnique({ where: { id } });
    if (!existing) throw new AppError("Không tìm thấy giải đấu", 404);

    return prisma.tournament.update({
      where: { id },
      data
    });
  },

  async deleteTournament(id: string) {
    const existing = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: {
          where: { status: RegistrationStatus.APPROVED }
        }
      }
    });

    if (!existing) throw new AppError("Không tìm thấy giải đấu", 404);

    if (existing.registrations.length > 0 && existing.status !== TournamentStatus.FINISHED) {
      throw new AppError("Không thể xóa giải đấu đang hoạt động đã có đội được duyệt. Chỉ có thể xóa giải đấu đã KẾT THÚC.", 400);
    }

    // Xóa tất cả dữ liệu liên quan (matches, regMembers, registrations)
    await prisma.$transaction([
      prisma.match.deleteMany({
        where: { tournamentId: id }
      }),
      prisma.regMember.deleteMany({
        where: { registration: { tournamentId: id } }
      }),
      prisma.registration.deleteMany({
        where: { tournamentId: id }
      }),
      prisma.tournament.delete({
        where: { id }
      })
    ]);

    return { message: "Xóa giải đấu thành công" };
  }
};
