const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiablePostgresPersistence } from 'pip-services3-postgres-node';

import { BeaconV1 } from '../data/version1/BeaconV1';
import { IBeaconsPersistence } from './IBeaconsPersistence';

export class BeaconsPostgresPersistence
    extends IdentifiablePostgresPersistence<BeaconV1, string>
    implements IBeaconsPersistence {

    constructor() {
        super('beacons');
        this.autoCreateObject('CREATE TABLE beacons (id VARCHAR(32), site_id VARCHAR(32), type VARCHAR(15), udi VARCHAR(25), label VARCHAR(50), center JSONB, radius REAL)');
        this.ensureIndex('beacons_site_id', { site_id: 1 });
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let filters = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            filters.push("id='" + id + "'");

        let siteId = filter.getAsNullableString('site_id');
        if (siteId != null) 
            filters.push("site_id='" + siteId + "'");

        let label = filter.getAsNullableString('label');
        if (label != null)
            filters.push("label='" + label + "'");

        let udi = filter.getAsNullableString('udi');
        if (udi != null)
            filters.push("udi='" + udi + "'");
    
        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (_.isArray(udis))
            filters.push("udi IN ('" + udis.join("','") + "')");
    
        return filters.length > 0 ? filters.join(" AND ") : null;        
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "id", null, callback);
    }

    public getOneByUdi(correlationId: string, udi: string,
        callback: (err: any, item: BeaconV1) => void): void {

        let query = "SELECT * FROM " + this.quoteIdentifier(this._tableName) + " WHERE \"udi\"=$1";
        let params = [ udi ];

        this._client.query(query, params, (err, result) => {
            err = err || null;

            let item = result && result.rows ? result.rows[0] || null : null; 

            if (item == null)
                this._logger.trace(correlationId, "Cannot find beacon with udi=%s", this._tableName, udi);
            else
                this._logger.trace(correlationId, "Found beacon with udi=%s", this._tableName, udi);

            item = this.convertToPublic(item);
            callback(err, item);
        });    
    }
}