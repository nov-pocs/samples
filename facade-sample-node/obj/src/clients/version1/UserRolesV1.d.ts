import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class UserRolesV1 implements IStringIdentifiable {
    constructor(id: string, roles: string[]);
    id: string;
    roles: string[];
    update_time: Date;
}
