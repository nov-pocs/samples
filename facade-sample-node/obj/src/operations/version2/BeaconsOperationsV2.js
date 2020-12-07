"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class BeaconsOperationsV2 extends pip_services3_rpc_node_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('beacons', new pip_services3_commons_node_1.Descriptor('nov-services-beacons', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._beaconsClient = this._dependencyResolver.getOneRequired('beacons');
    }
    getBeaconsX(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let siteId = req.params.site_id;
        filter.setAsObject('site_id', siteId);
        this._beaconsClient.getBeacons(null, filter, paging, this.sendResult(req, res));
    }
    getBeaconX(req, res) {
        let siteId = req.params.site_id;
        let beaconId = req.params.beacon_id;
        this._beaconsClient.getBeaconById(null, beaconId, this.sendResult(req, res));
    }
    calculatePositionX(req, res) {
        let siteId = req.params.site_id;
        let udis = req.param('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        this._beaconsClient.calculatePosition(null, siteId, udis, this.sendResult(req, res));
    }
    createBeaconX(req, res) {
        let siteId = req.params.site_id;
        let beacon = req.body || {};
        this._beaconsClient.createBeacon(null, beacon, this.sendResult(req, res));
    }
    updateBeaconX(req, res) {
        let beaconId = req.params.beacon_id;
        let siteId = req.params.site_id;
        let beacon = req.body || {};
        beacon.id = beaconId;
        this._beaconsClient.updateBeacon(null, beacon, this.sendResult(req, res));
    }
    deleteBeaconX(req, res) {
        let beaconId = req.params.beacon_id;
        let siteId = req.params.site_id;
        this._beaconsClient.deleteBeaconById(null, beaconId, this.sendResult(req, res));
    }
    validateBeaconUdiX(req, res) {
        let siteId = req.params.site_id;
        let udi = req.param('udi');
        this._beaconsClient.getBeaconByUdi(null, udi, (err, beacon) => {
            if (beacon)
                res.json(beacon.id);
            else
                res.json('');
        });
    }
}
exports.BeaconsOperationsV2 = BeaconsOperationsV2;
//# sourceMappingURL=BeaconsOperationsV2.js.map