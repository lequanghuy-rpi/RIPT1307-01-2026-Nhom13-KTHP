interface RegisterInput {
    username: string;
    email: string;
    password: string;
}
interface LoginInput {
    email: string;
    password: string;
}
export declare const authService: {
    register(data: RegisterInput): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStats(userId: string): Promise<{
        tournamentsJoined: number;
        totalKills: number;
        totalTop1: number;
    }>;
    updateAvatar(userId: string, avatarBase64: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    removeAvatar(userId: string): Promise<{
        id: string;
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    deleteAccount(userId: string): Promise<void>;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map