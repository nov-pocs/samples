"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services = require('../../../../src/protos/beacons_v1_grpc_pb');
const messages = require('../../../../src/protos/beacons_v1_pb');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_grpc_node_1 = require("pip-services3-grpc-node");
const BeaconsGrpcConverterV1_1 = require("./BeaconsGrpcConverterV1");
class BeaconsGrpcServiceV1 extends pip_services3_grpc_node_1.GrpcService {
    constructor() {
        super(services.BeaconsV1Service);
        this._dependencyResolver.put('controller', new pip_services3_commons_node_2.Descriptor("beacons", "controller", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getBeacons(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let filter = new pip_services3_commons_node_1.FilterParams();
        BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.setMap(filter, call.request.getFilterMap());
        let paging = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toPagingParams(call.request.getPaging());
        this._controller.getBeacons(correlationId, filter, paging, (err, page) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1PageReply();
            response.setError(error);
            response.setPage(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeaconsPage(page));
            callback(err, response);
        });
    }
    getBeaconById(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let beaconId = call.request.getBeaconId();
        this._controller.getBeaconById(correlationId, beaconId, (err, values) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1ObjectReply();
            response.setError(error);
            response.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(values));
            callback(err, response);
        });
    }
    getBeaconByUdi(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let udi = call.request.getBeaconUdi();
        this._controller.getBeaconByUdi(correlationId, udi, (err, values) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1ObjectReply();
            response.setError(error);
            response.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(values));
            callback(err, response);
        });
    }
    calculatePosition(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let siteId = call.request.getSiteId();
        let udis = call.request.getUdisList();
        this._controller.calculatePosition(correlationId, siteId, udis, (err, value) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1PositionReply();
            response.setError(error);
            response.setPoint(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromPosition(value));
            callback(err, response);
        });
    }
    createBeacon(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(call.request.getBeacon());
        this._controller.createBeacon(correlationId, beacon, (err, values) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1ObjectReply();
            response.setError(error);
            response.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(values));
            callback(err, response);
        });
    }
    updateBeacon(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let beacon = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.toBeacon(call.request.getBeacon());
        this._controller.updateBeacon(correlationId, beacon, (err, values) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1ObjectReply();
            response.setError(error);
            response.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(values));
            callback(err, response);
        });
    }
    deleteBeaconById(call, callback) {
        let correlationId = call.request.getCorrelationId();
        let beaconId = call.request.getBeaconId();
        this._controller.deleteBeaconById(correlationId, beaconId, (err, values) => {
            let error = BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromError(err);
            let response = new messages.BeaconV1ObjectReply();
            response.setError(error);
            response.setBeacon(BeaconsGrpcConverterV1_1.BeaconsGrpcConverterV1.fromBeacon(values));
            callback(err, response);
        });
    }
    register() {
        this.registerMethod('get_beacons', new pip_services3_commons_node_3.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_1.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_1.PagingParamsSchema()), this.getBeacons);
        this.registerMethod('get_beacon_by_id', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beaconId', pip_services3_commons_node_4.TypeCode.String), this.getBeaconById);
        this.registerMethod('get_beacon_by_udi', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beaconUdi', pip_services3_commons_node_4.TypeCode.String), this.getBeaconByUdi);
        this.registerMethod('calculate_position', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('siteId', pip_services3_commons_node_4.TypeCode.String)
            .withRequiredProperty('udisList', new pip_services3_commons_node_1.ArraySchema(pip_services3_commons_node_4.TypeCode.String)), this.calculatePosition);
        this.registerMethod('create_beacon', null, this.createBeacon);
        this.registerMethod('update_beacon', null, this.updateBeacon);
        this.registerMethod('delete_beacon_by_id', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beaconId', pip_services3_commons_node_4.TypeCode.String), this.deleteBeaconById);
    }
}
exports.BeaconsGrpcServiceV1 = BeaconsGrpcServiceV1;
//# sourceMappingURL=BeaconsGrpcServiceV1.js.map