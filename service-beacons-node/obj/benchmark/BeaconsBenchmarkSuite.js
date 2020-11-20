"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsBenchmarkSuite = void 0;
const async = require('async');
const _ = require('lodash');
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const RandomBeaconV1_1 = require("../src/data/version1/RandomBeaconV1");
const BeaconsBenchmarkContext_1 = require("./BeaconsBenchmarkContext");
const BeaconsCalculateBenchmark_1 = require("./BeaconsCalculateBenchmark");
const BeaconsReadBenchmark_1 = require("./BeaconsReadBenchmark");
class BeaconsBenchmarkSuite extends pip_benchmark_node_1.BenchmarkSuite {
    constructor() {
        super("Beacons", "Beacons benchmark");
        this.addParameter(new pip_benchmark_node_2.Parameter('RecordCount', 'Number of records at start', '0'));
        this.addParameter(new pip_benchmark_node_2.Parameter('SiteCount', 'Number of field sites', '100'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabaseType', 'Database type', 'postgres'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabaseUri', 'Database URI', null));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabaseHost', 'Database hostname', 'localhost'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabasePort', 'Database port', '5432'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabaseName', 'Database name', 'test'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabaseUser', 'Database username', 'postgres'));
        this.addParameter(new pip_benchmark_node_2.Parameter('DatabasePassword', 'Database password', 'postgres'));
        this.addBenchmark(new BeaconsCalculateBenchmark_1.BeaconsCalculateBenchmark());
        this.addBenchmark(new BeaconsReadBenchmark_1.BeaconsReadBenchmark());
    }
    setUp(callback) {
        let totalCount = this.context.parameters['RecordCount'].getAsInteger();
        let siteCount = this.context.parameters['SiteCount'].getAsInteger();
        let currentCount = 0;
        let context = new BeaconsBenchmarkContext_1.BeaconsBenchmarkContext(this.context);
        async.series([
            // Connect to the database
            (callback) => {
                context.open(callback);
            },
            // Get number of records in the database
            (callback) => {
                context.persistence.getPageByFilter(null, null, new pip_services3_commons_node_1.PagingParams(0, 1, true), (err, page) => {
                    currentCount = page != null ? page.total || 0 : 0;
                    callback(err);
                });
            },
            // Generate initial records
            (callback) => {
                if (currentCount >= totalCount) {
                    callback(null);
                    return;
                }
                this.context.sendMessage("Creating " + (totalCount - currentCount) + " beacons...");
                async.whilst((callback) => {
                    if (_.isFunction(callback)) {
                        callback(null, currentCount < totalCount);
                        return;
                    }
                    else {
                        return currentCount < totalCount;
                    }
                }, (callback) => {
                    let beacon = RandomBeaconV1_1.RandomBeaconV1.nextBeacon(siteCount);
                    context.persistence.create(null, beacon, (err, beacon) => {
                        currentCount++;
                        if (currentCount % 100 == 0) {
                            this.context.sendMessage("Created " + currentCount + " beacons");
                        }
                        callback(err);
                    });
                }, (err) => {
                    this.context.sendMessage("Initial beacons successfully created.");
                    callback(err);
                });
            }
        ], (err) => {
            // Disconnect from the database
            context.close((err1) => {
                err = err || err1;
                callback(err);
            });
        });
    }
}
exports.BeaconsBenchmarkSuite = BeaconsBenchmarkSuite;
//# sourceMappingURL=BeaconsBenchmarkSuite.js.map