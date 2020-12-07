import { IStringIdentifiable } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

export class SessionV1 implements IStringIdentifiable {
    public constructor(id: string, user_id: string, user_name?: string,
        address?: string, client?: string) {
        this.id = id || IdGenerator.nextLong();
        this.user_id = user_id;
        this.user_name = user_name;
        this.active = true;
        this.open_time = new Date();
        this.request_time = new Date();
        this.address = address;
        this.client = client;
    }

    /* Identification */
    public id: string;
    public user_id: string;
    public user_name: string;
    
    /* Session info */
    public active: boolean;
    public open_time: Date;
    public close_time: Date;
    public request_time: Date;
    public address: string;
    public client: string;

    /* Cached content */
    public user: any;
    public data: any;
}