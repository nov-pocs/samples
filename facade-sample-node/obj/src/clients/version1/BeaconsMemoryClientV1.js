"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class BeaconsMemoryClientV1 {
    constructor() {
        this._beacons = [];
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
    getBeacons(correlationId, filter, paging, callback) {
        let beacons = _.filter(this._beacons, this.composeFilter(filter));
        callback(null, new pip_services3_commons_node_2.DataPage(beacons, beacons.length));
    }
    getBeaconById(correlationId, beaconId, callback) {
        let beacon = _.find(this._beacons, (d) => d.id == beaconId);
        callback(null, beacon);
    }
    getBeaconByUdi(correlationId, udi, callback) {
        let beacon = _.find(this._beacons, (item) => item.udi == udi);
        callback(null, beacon);
    }
    calculatePosition(correlationId, siteId, udis, callback) {
        let beacons;
        let position = null;
        if (udis == null || udis.length == 0) {
            callback(null, null);
            return;
        }
        async.series([
            (callback) => {
                this.getBeacons(correlationId, pip_services3_commons_node_1.FilterParams.fromTuples('site_id', siteId, 'udis', udis), null, (err, page) => {
                    beacons = page ? page.data : [];
                    callback(err);
                });
            },
            (callback) => {
                let lat = 0;
                let lng = 0;
                let count = 0;
                for (let beacon of beacons) {
                    if (beacon.center != null
                        && beacon.center.type == 'Point'
                        && _.isArray(beacon.center.coordinates)) {
                        lng += beacon.center.coordinates[0];
                        lat += beacon.center.coordinates[1];
                        count += 1;
                    }
                }
                if (count > 0) {
                    position = {
                        type: 'Point',
                        coordinates: [lng / count, lat / count]
                    };
                }
                callback();
            }
        ], (err) => { callback(err, err == null ? position : null); });
    }
    createBeacon(correlationId, beacon, callback) {
        beacon.id = beacon.id || pip_services3_commons_node_3.IdGenerator.nextLong();
        beacon.type = beacon.type || "unknown";
        this._beacons.push(beacon);
        callback(null, beacon);
    }
    updateBeacon(correlationId, beacon, callback) {
        beacon.type = beacon.type || "unknown";
        this._beacons = _.filter(this._beacons, (d) => d.id != beacon.id);
        this._beacons.push(beacon);
        callback(null, beacon);
    }
    deleteBeaconById(correlationId, beaconId, callback) {
        let beacon = _.find(this._beacons, (d) => d.id == beaconId);
        if (beacon)
            this._beacons = _.filter(this._beacons, (d) => d.id != beacon.id);
        callback(null, beacon);
    }
}
exports.BeaconsMemoryClientV1 = BeaconsMemoryClientV1;
//# sourceMappingURL=BeaconsMemoryClientV1.js.map