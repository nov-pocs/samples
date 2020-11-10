let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { BeaconV1 } from '../data/version1/BeaconV1';
import { IBeaconsPersistence } from './IBeaconsPersistence';

export class BeaconsMemoryPersistence
    extends IdentifiableMemoryPersistence<BeaconV1, string>
    implements IBeaconsPersistence {

    constructor() {
        super();

        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let siteId = filter.getAsNullableString('site_id');
        let label = filter.getAsNullableString('label');
        let udi = filter.getAsNullableString('udi');
        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (!_.isArray(udis))
            udis = null;

        return (item) => {
            if (id != null && item.id != id)
                return false;
            if (siteId != null && item.site_id != siteId)
                return false;
            if (label != null && item.label != label)
                return false;
            if (udi != null && item.udi != udi)
                return false;
            if (udis != null && _.indexOf(udis, item.udi) < 0)
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getOneByUdi(correlationId: string, udi: string,
        callback: (err: any, item: BeaconV1) => void): void {
        
        let item = _.find(this._items, (item) => item.udi == udi);

        if (item != null) this._logger.trace(correlationId, "Found beacon by %s", udi);
        else this._logger.trace(correlationId, "Cannot find beacon by %s", udi);

        callback(null, item);
    }


}