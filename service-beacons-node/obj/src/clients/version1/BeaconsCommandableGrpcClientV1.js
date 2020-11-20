"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsCommandableGrpcClientV1 = void 0;
const pip_services3_grpc_node_1 = require("pip-services3-grpc-node");
class BeaconsCommandableGrpcClientV1 extends pip_services3_grpc_node_1.CommandableGrpcClient {
    constructor() {
        super('beacons_v1');
        this._blockCount = 1;
        this._ids = null;
    }
    configure(config) {
        super.configure(config);
        this._blockCount = config.getAsIntegerWithDefault("options.block_count", this._blockCount);
    }
    getBeacons(correlationId, filter, paging, callback) {
        this.callCommand('get_beacons', correlationId, {
            filter: filter,
            paging: paging
        }, callback);
    }
    getBeaconById(correlationId, beaconId, callback) {
        this.callCommand('get_beacon_by_id', correlationId, {
            beacon_id: beaconId
        }, callback);
    }
    getBeaconByUdi(correlationId, udi, callback) {
        this.callCommand('get_beacon_by_udi', correlationId, {
            udi: udi
        }, callback);
    }
    calculatePosition(correlationId, siteId, udis, callback) {
        this.callCommand('calculate_position', correlationId, {
            site_id: siteId,
            udis: udis
        }, callback);
    }
    createBeacon(correlationId, beacon, callback) {
        this.callCommand('create_beacon', correlationId, {
            beacon: beacon
        }, callback);
    }
    updateBeacon(correlationId, beacon, callback) {
        this.callCommand('update_beacon', correlationId, {
            beacon: beacon
        }, callback);
    }
    deleteBeaconById(correlationId, beaconId, callback) {
        this.callCommand('delete_beacon_by_id', correlationId, {
            beacon_id: beaconId
        }, callback);
    }
}
exports.BeaconsCommandableGrpcClientV1 = BeaconsCommandableGrpcClientV1;
//# sourceMappingURL=BeaconsCommandableGrpcClientV1.js.map