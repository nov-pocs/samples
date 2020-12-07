import { ConfigParams } from 'pip-services3-commons-node';
import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class SettingsSectionV1 implements IStringIdentifiable {
    constructor(id: string, parameters?: ConfigParams);
    id: string;
    parameters: ConfigParams;
    update_time: Date;
}
