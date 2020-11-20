"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsReadBenchmark = void 0;
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const BeaconsBenchmarkContext_1 = require("./BeaconsBenchmarkContext");
class BeaconsReadBenchmark extends pip_benchmark_node_1.Benchmark {
    constructor() {
        super("ReadBeacons", "Measures performance of getBeacons operation");
    }
    setUp(callback) {
        this._siteCount = this.context.parameters['SiteCount'].getAsInteger();
        this._beaconsContext = new BeaconsBenchmarkContext_1.BeaconsBenchmarkContext(this.context);
        // Connext to the database
        this._beaconsContext.open(callback);
    }
    tearDown(callback) {
        // Disconnect from the database
        this._beaconsContext.close(callback);
    }
    execute(callback) {
        let siteId = pip_services3_commons_node_3.RandomInteger.nextInteger(1, this._siteCount).toString();
        this._beaconsContext.controller.getBeacons(null, pip_services3_commons_node_1.FilterParams.fromTuples('site_id', siteId), new pip_services3_commons_node_2.PagingParams(0, 100, false), callback);
    }
}
exports.BeaconsReadBenchmark = BeaconsReadBenchmark;
//# sourceMappingURL=BeaconsReadBenchmark.js.map