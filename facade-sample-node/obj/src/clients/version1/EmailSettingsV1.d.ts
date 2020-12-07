import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class EmailSettingsV1 implements IStringIdentifiable {
    id: string;
    name: string;
    email: string;
    language?: string;
    subscriptions?: any;
    verified?: boolean;
    ver_code?: string;
    ver_expire_time?: Date;
    custom_hdr?: any;
    custom_dat?: any;
}
