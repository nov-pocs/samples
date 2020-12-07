import { IStringIdentifiable } from 'pip-services3-commons-node';

export class SiteV1 implements IStringIdentifiable {
    public id: string;
    public code?: string;
    public create_time?: Date;
    public creator_id?: string;
    public deleted?: boolean;
    public active: boolean;

    public name: string;
    public description?: string;
    public address?: string;

    public center?: any; // GeoJSON
    public radius?: number; // In km
    public geometry?: any; //GeoJSON
    public boundaries?: any; //GeoJSON

    public language?: string;
    public timezone?: string;
    public industry?: string;
    public org_size?: number;
    public total_sites?: number;
    public purpose?: string;
    public params?: any;
}