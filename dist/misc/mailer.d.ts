declare const nodemailer: any;
declare const config: any;
declare const auth: {
    service: string;
    port: number;
    host: string;
    auth: {
        user: any;
        pass: any;
    };
    tls: {
        rejectUnauthorized: boolean;
    };
};
declare const sendMail: (email: any, subject: any, text: any, cb: any) => Promise<void>;
