import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class SessionV1 implements IStringIdentifiable {
    constructor(id: string, user_id: string, user_name?: string, address?: string, client?: string);
    id: string;
    user_id: string;
    user_name: string;
    active: boolean;
    open_time: Date;
    close_time: Date;
    request_time: Date;
    address: string;
    client: string;
    user: any;
    data: any;
}
