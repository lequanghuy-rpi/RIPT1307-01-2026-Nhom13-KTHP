export declare const config: {
    readonly port: number;
    readonly nodeEnv: string;
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshSecret: string;
        readonly refreshExpiresIn: string;
    };
    readonly cors: {
        readonly origin: string;
    };
    readonly mail: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly pass: string;
        readonly from: string;
    };
};
export default config;
//# sourceMappingURL=env.d.ts.map