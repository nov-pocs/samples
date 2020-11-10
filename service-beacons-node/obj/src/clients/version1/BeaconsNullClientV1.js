"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class BeaconsNullClientV1 {
    getBeacons(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_1.DataPage([], 0));
    }
    getBeaconById(correlationId, beaconId, callback) {
        callback(null, null);
    }
    getBeaconByUdi(correlationId, udi, callback) {
        callback(null, null);
    }
    calculatePosition(correlationId, siteId, udis, callback) {
        callback(null, null);
    }
    createBeacon(correlationId, beacon, callback) {
        callback(null, null);
    }
    updateBeacon(correlationId, beacon, callback) {
        callback(null, null);
    }
    deleteBeaconById(correlationId, beaconId, callback) {
        callback(null, null);
    }
}
exports.BeaconsNullClientV1 = BeaconsNullClientV1;
//# sourceMappingURL=BeaconsNullClientV1.js.map