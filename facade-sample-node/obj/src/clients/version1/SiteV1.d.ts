import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class SiteV1 implements IStringIdentifiable {
    id: string;
    code?: string;
    create_time?: Date;
    creator_id?: string;
    deleted?: boolean;
    active: boolean;
    name: string;
    description?: string;
    address?: string;
    center?: any;
    radius?: number;
    geometry?: any;
    boundaries?: any;
    language?: string;
    timezone?: string;
    industry?: string;
    org_size?: number;
    total_sites?: number;
    purpose?: string;
    params?: any;
}
