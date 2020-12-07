import { IStringIdentifiable } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

export class AccountV1 implements IStringIdentifiable {

    public constructor(id: string, login: string, name: string) {
        this.id = id || IdGenerator.nextLong();
        this.login = login;
        this.name = name;

        this.create_time = new Date();
        this.active = true;
    }

    /* Identification */
    public id: string;
    public login: string;
    public name: string;

    /* Activity tracking */
    public create_time: Date;
    public deleted?: boolean;
    public active: boolean;

    /* User preferences */
    public time_zone: string;
    public language: string;
    public theme: string;

    /* Custom fields */
    public custom_hdr: any;
    public custom_dat: any;

}