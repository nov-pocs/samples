"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsGrpcClientV1 = void 0;
const services = require('../../../../src/protos/beacons_v1_grpc_pb');
const messages = require('../../../../src/protos/beacons_v1_pb');
const pip_services3_grpc_node_1 = require("pip-services3-grpc-node");
const BeaconsGrpcConverterV1_1 = require("../../services/version1/BeaconsGrpcConverterV1");
class BeaconsGrpcClientV1 extends pip_services3_grpc_node_1.GrpcClient {
    constructor() {
        super(services.BeaconsV1Client);
    }
    getBeacons(correlationId, filter, paging, callback) {
        let request = new messages.BeaconV1PageRequest();
        BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.setMap(request.getFilterMap(), filter);
        request.setPaging(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromPagingParams(paging));
        let timing = this.instrument(correlationId, 'beacons.get_beacons');
        this.call('get_beacons', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
                return;
            }
            let page = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeaconsPage(response.getPage());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, page);
        });
    }
    getBeaconById(correlationId, beaconId, callback) {
        let request = new messages.BeaconV1IdRequest();
        request.setBeaconId(beaconId);
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_id');
        this.call('get_beacon_by_id', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, beacon);
        });
    }
    getBeaconByUdi(correlationId, udi, callback) {
        let request = new messages.BeaconV1UdiRequest();
        request.setBeaconUdi(udi);
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_udi');
        this.call('get_beacon_by_udi', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, beacon);
        });
    }
    calculatePosition(correlationId, siteId, udis, callback) {
        let request = new messages.BeaconV1PositionRequest();
        request.setSiteId(siteId);
        request.setUdisList(udis);
        let timing = this.instrument(correlationId, 'beacons.calculate_position');
        this.call('calculate_position', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let position = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toPosition(response.getPoint());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, position);
        });
    }
    createBeacon(correlationId, beacon, callback) {
        let request = new messages.BeaconV1ObjectRequest();
        request.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(beacon));
        let timing = this.instrument(correlationId, 'beacons.create_beacon');
        this.call('create_beacon', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, beacon);
        });
    }
    updateBeacon(correlationId, beacon, callback) {
        let request = new messages.BeaconV1ObjectRequest();
        request.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(beacon));
        let timing = this.instrument(correlationId, 'beacons.update_beacon');
        this.call('update_beacon', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, beacon);
        });
    }
    deleteBeaconById(correlationId, beaconId, callback) {
        let request = new messages.BeaconV1IdRequest();
        request.setBeaconId(beaconId);
        let timing = this.instrument(correlationId, 'beacons.delete_beacon_by_id');
        this.call('delete_beacon_by_id', correlationId, request, (err, response) => {
            timing.endTiming();
            if (err) {
                callback(err, null);
            }
            let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
            err = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toError(response.getError());
            callback(err, beacon);
        });
    }
}
exports.BeaconsGrpcClientV1 = BeaconsGrpcClientV1;
//# sourceMappingURL=BeaconsGrpcClientV1.js.map