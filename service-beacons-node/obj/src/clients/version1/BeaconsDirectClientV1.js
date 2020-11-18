"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class BeaconsDirectClientV1 extends pip_services3_rpc_node_1.DirectClient {
    constructor() {
        super();
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('beacons', 'controller', '*', '*', '1.0'));
    }
    getBeacons(correlationId, filter, paging, callback) {
        let timing = this.instrument(correlationId, 'beacons.get_beacons');
        this._controller.getBeacons(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }
    getBeaconById(correlationId, beaconId, callback) {
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_id');
        this._controller.getBeaconById(correlationId, beaconId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        });
    }
    getBeaconByUdi(correlationId, udi, callback) {
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_udi');
        this._controller.getBeaconByUdi(correlationId, udi, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        });
    }
    calculatePosition(correlationId, siteId, udis, callback) {
        let timing = this.instrument(correlationId, 'beacons.calculate_position');
        this._controller.calculatePosition(correlationId, siteId, udis, (err, position) => {
            timing.endTiming();
            callback(err, position);
        });
    }
    createBeacon(correlationId, beacon, callback) {
        let timing = this.instrument(correlationId, 'beacons.create_beacon');
        this._controller.createBeacon(correlationId, beacon, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        });
    }
    updateBeacon(correlationId, beacon, callback) {
        let timing = this.instrument(correlationId, 'beacons.update_beacon');
        this._controller.updateBeacon(correlationId, beacon, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        });
    }
    deleteBeaconById(correlationId, beaconId, callback) {
        let timing = this.instrument(correlationId, 'beacons.delete_beacon_by_id');
        this._controller.deleteBeaconById(correlationId, beaconId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        });
    }
}
exports.BeaconsDirectClientV1 = BeaconsDirectClientV1;
//# sourceMappingURL=BeaconsDirectClientV1.js.map