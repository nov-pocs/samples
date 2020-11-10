import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableJsonPostgresPersistence } from 'pip-services3-postgres-node';
import { BeaconV1 } from '../data/version1/BeaconV1';
import { IBeaconsPersistence } from './IBeaconsPersistence';
export declare class BeaconsJsonPostgresPersistence extends IdentifiableJsonPostgresPersistence<BeaconV1, string> implements IBeaconsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<BeaconV1>) => void): void;
    getOneByUdi(correlationId: string, udi: string, callback: (err: any, item: BeaconV1) => void): void;
}
