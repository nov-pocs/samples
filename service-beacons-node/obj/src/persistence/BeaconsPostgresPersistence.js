"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsPostgresPersistence = void 0;
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_postgres_node_1 = require("pip-services3-postgres-node");
class BeaconsPostgresPersistence extends pip_services3_postgres_node_1.IdentifiablePostgresPersistence {
    constructor() {
        super('beacons');
        this.autoCreateObject('CREATE TABLE beacons (id VARCHAR(32), site_id VARCHAR(32), type VARCHAR(15), udi VARCHAR(25), label VARCHAR(50), center JSONB, radius REAL)');
        this.ensureIndex('beacons_site_id', { site_id: 1 });
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "id", null, callback);
    }
    getOneByUdi(correlationId, udi, callback) {
        let query = "SELECT * FROM " + this.quoteIdentifier(this._tableName) + " WHERE \"udi\"=$1";
        let params = [udi];
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
exports.BeaconsPostgresPersistence = BeaconsPostgresPersistence;
//# sourceMappingURL=BeaconsPostgresPersistence.js.map