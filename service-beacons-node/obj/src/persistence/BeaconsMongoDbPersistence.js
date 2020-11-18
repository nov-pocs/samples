"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class BeaconsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('beacons');
        this.ensureIndex({ site_id: 1, udi: 1 });
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        let siteId = filter.getAsNullableString('site_id');
        if (siteId != null)
            criteria.push({ site_id: siteId });
        let label = filter.getAsNullableString('label');
        if (label != null)
            criteria.push({ label: label });
        let udi = filter.getAsNullableString('udi');
        if (udi != null) {
            criteria.push({ udi: udi });
        }
        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (_.isArray(udis))
            criteria.push({ udi: { $in: udis } });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getOneByUdi(correlationId, udi, callback) {
        let criteria = {
            udi: udi
        };
        this._collection.findOne(criteria, (err, item) => {
            item = this.convertToPublic(item);
            if (item != null)
                this._logger.trace(correlationId, "Found beacon by %s", udi);
            else
                this._logger.trace(correlationId, "Cannot find beacon by %s", udi);
            callback(err, item);
        });
    }
}
exports.BeaconsMongoDbPersistence = BeaconsMongoDbPersistence;
//# sourceMappingURL=BeaconsMongoDbPersistence.js.map