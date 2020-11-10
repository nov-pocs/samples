const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableJsonPostgresPersistence } from 'pip-services3-postgres-node';

import { BeaconV1 } from '../data/version1/BeaconV1';
import { IBeaconsPersistence } from './IBeaconsPersistence';

export class BeaconsJsonPostgresPersistence
    extends IdentifiableJsonPostgresPersistence<BeaconV1, string>
    implements IBeaconsPersistence {

    constructor() {
        super('beacons_json');
        this.ensureTable('VARCHAR(32)', 'JSONB');
        this.ensureIndex('beacons_json_site_id', { "data->>'site_id'": 1 });
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let filters = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            filters.push("data->>'id'='" + id + "'");

        let siteId = filter.getAsNullableString('site_id');
        if (siteId != null) 
            filters.push("data->>'site_id'='" + siteId + "'");

        let label = filter.getAsNullableString('label');
        if (label != null)
            filters.push("data->>'label'='" + label + "'");

        let udi = filter.getAsNullableString('udi');
        if (udi != null)
            filters.push("data->>'udi'='" + udi + "'");
    
        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (_.isArray(udis))
            filters.push("data->>'udi' IN ('" + udis.join("','") + "')");
    
        return filters.length > 0 ? filters.join(" AND ") : null;        
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "id", null, callback);
    }

    public getOneByUdi(correlationId: string, udi: string,
        callback: (err: any, item: BeaconV1) => void): void {

        let query = "SELECT * FROM " + this.quoteIdentifier(this._tableName) + " WHERE data->>'udi'=$1";
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