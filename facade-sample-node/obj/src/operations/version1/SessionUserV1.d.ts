export declare class SessionUserV1 {
    id: string;
    login: string;
    name: string;
    create_time: Date;
    time_zone: string;
    language: string;
    theme: string;
    roles: string[];
    change_pwd_time: Date;
    sites: {
        id: string;
        name: string;
    };
    settings: any;
    custom_hdr: any;
    custom_dat: any;
}
