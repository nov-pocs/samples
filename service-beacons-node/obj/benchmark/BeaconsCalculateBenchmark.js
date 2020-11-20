"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsCalculateBenchmark = void 0;
const _ = require('lodash');
const async = require('async');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const RandomBeaconV1_1 = require("../src/data/version1/RandomBeaconV1");
const BeaconsBenchmarkContext_1 = require("./BeaconsBenchmarkContext");
class BeaconsCalculateBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("CalculatePosition", "Measures performance of calculatePosition operation");
        this._udis = [];
    }
    setUp(callback) {
        let siteCount = this.context.parameters['SiteCount'].getAsInteger();
        this._siteId = RandomBeaconV1_1.RandomBeaconV1.nextSiteId(siteCount);
        this._beaconsContext = new BeaconsBenchmarkContext_1.BeaconsBenchmarkContext(this.context);
        async.series([
            // Connext to the database
            (callback) => {
                this._beaconsContext.open(callback);
            },
            // Get beacon udis
            (callback) => {
                this._beaconsContext.persistence.getPageByFilter(null, pip_services3_commons_node_1.FilterParams.fromTuples("site_id", this._siteId), new pip_services3_commons_node_2.PagingParams(0, 100, false), (err, page) => {
                    if (page != null) {
                        this._udis = _.map(page.data, b => b.udi);
                    }
                    callback(err);
                });
            }
        ], callback);
    }
    tearDown(callback) {
        // Disconnect from the database
        this._beaconsContext.close(callback);
    }
    nextUdis() {
        let udiCount = pip_services3_commons_node_3.RandomInteger.nextInteger(0, 10);
        let remainingUdis = [...this._udis];
        let udis = [];
        while (udiCount > 0 && remainingUdis.length > 0) {
            let index = pip_services3_commons_node_3.RandomInteger.nextInteger(0, remainingUdis.length - 1);
            udis.push(remainingUdis[index]);
            remainingUdis.splice(index, 1);
        }
        return udis;
    }
    execute(callback) {
        let udis = this.nextUdis();
        this._beaconsContext.controller.calculatePosition(null, this._siteId, udis, callback);
    }
}
exports.BeaconsCalculateBenchmark = BeaconsCalculateBenchmark;
//# sourceMappingURL=BeaconsCalculateBenchmark.js.map