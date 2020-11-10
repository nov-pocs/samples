"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const BeaconV1Schema_1 = require("../../src/data/version1/BeaconV1Schema");
class BeaconsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeGetBeaconsCommand());
        this.addCommand(this.makeGetBeaconByIdCommand());
        this.addCommand(this.makeGetBeaconByUdiCommand());
        this.addCommand(this.makeCalculatePositionCommand());
        this.addCommand(this.makeCreateBeaconCommand());
        this.addCommand(this.makeUpdateBeaconCommand());
        this.addCommand(this.makeDeleteBeaconByIdCommand());
    }
    makeGetBeaconsCommand() {
        return new pip_services3_commons_node_2.Command('get_beacons', new pip_services3_commons_node_3.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_4.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_5.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_1.FilterParams.fromValue(args.get('filter'));
            let paging = pip_services3_commons_node_1.PagingParams.fromValue(args.get('paging'));
            this._controller.getBeacons(correlationId, filter, paging, callback);
        });
    }
    makeGetBeaconByIdCommand() {
        return new pip_services3_commons_node_2.Command('get_beacon_by_id', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beacon_id', pip_services3_commons_node_7.TypeCode.String), (correlationId, args, callback) => {
            let beaconId = args.getAsString('beacon_id');
            this._controller.getBeaconById(correlationId, beaconId, callback);
        });
    }
    makeGetBeaconByUdiCommand() {
        return new pip_services3_commons_node_2.Command('get_beacon_by_udi', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('udi', pip_services3_commons_node_7.TypeCode.String), (correlationId, args, callback) => {
            let udi = args.getAsString('udi');
            this._controller.getBeaconByUdi(correlationId, udi, callback);
        });
    }
    makeCalculatePositionCommand() {
        return new pip_services3_commons_node_2.Command('calculate_position', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('site_id', pip_services3_commons_node_7.TypeCode.String)
            .withRequiredProperty('udis', new pip_services3_commons_node_6.ArraySchema(pip_services3_commons_node_7.TypeCode.String)), (correlationId, args, callback) => {
            let siteId = args.getAsString('site_id');
            let udis = args.getAsObject('udis');
            this._controller.calculatePosition(correlationId, siteId, udis, callback);
        });
    }
    makeCreateBeaconCommand() {
        return new pip_services3_commons_node_2.Command('create_beacon', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beacon', new BeaconV1Schema_1.BeaconV1Schema()), (correlationId, args, callback) => {
            let beacon = args.getAsObject('beacon');
            this._controller.createBeacon(correlationId, beacon, callback);
        });
    }
    makeUpdateBeaconCommand() {
        return new pip_services3_commons_node_2.Command('update_beacon', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beacon', new BeaconV1Schema_1.BeaconV1Schema()), (correlationId, args, callback) => {
            let beacon = args.getAsObject('beacon');
            this._controller.updateBeacon(correlationId, beacon, callback);
        });
    }
    makeDeleteBeaconByIdCommand() {
        return new pip_services3_commons_node_2.Command('delete_beacon_by_id', new pip_services3_commons_node_3.ObjectSchema(true)
            .withRequiredProperty('beacon_id', pip_services3_commons_node_7.TypeCode.String), (correlationId, args, callback) => {
            let beaconId = args.getAsString('beacon_id');
            this._controller.deleteBeaconById(correlationId, beaconId, callback);
        });
    }
}
exports.BeaconsCommandSet = BeaconsCommandSet;
//# sourceMappingURL=BeaconsCommandSet.js.map