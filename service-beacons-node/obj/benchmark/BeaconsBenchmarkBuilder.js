"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsBenchmarkBuilder = void 0;
const pip_benchmark_node_1 = require("pip-benchmark-node");
const pip_benchmark_node_2 = require("pip-benchmark-node");
const pip_benchmark_node_3 = require("pip-benchmark-node");
const BeaconsBenchmarkSuite_1 = require("./BeaconsBenchmarkSuite");
class BeaconsBenchmarkBuilder extends pip_benchmark_node_1.ConsoleBenchmarkBuilder {
    constructor() {
        super();
        this.addSuite(new BeaconsBenchmarkSuite_1.BeaconsBenchmarkSuite());
        this.setEnvParameters();
    }
    setEnvParameters() {
        let databaseType = process.env['DATABASE_TYPE'] || 'postgres';
        let DB = databaseType.toUpperCase();
        this.withParameter('Beacons.RecordCount', process.env['BENCHMARK_RECORDS'] || 1000);
        this.withParameter('Beacons.SiteCount', process.env['BENCHMARK_SITES'] || 100);
        this.withParameter('Beacons.DatabaseUri', process.env[DB + '_SERVICE_URI']);
        this.withParameter('Beacons.DatabaseHost', process.env[DB + '_SERVICE_HOST'] || 'localhost');
        this.withParameter('Beacons.DatabasePort', process.env[DB + '_SERVICE_PORT'] || 5432);
        this.withParameter('Beacons.DatabaseName', process.env[DB + '_DB'] || 'test');
        this.withParameter('Beacons.DatabaseUser', process.env[DB + '_USER'] || 'postgres');
        this.withParameter('Beacons.DatabasePassword', process.env[DB + '_PASS'] || 'postgres');
        return this;
    }
    forPerformanceTesting() {
        this.forceContinue(false);
        this.measureAs(pip_benchmark_node_2.MeasurementType.Peak);
        this.executeAs(pip_benchmark_node_3.ExecutionType.Sequential);
        this.withBenchmark("Beacons.CalculatePosition");
        this.withBenchmark("Beacons.ReadBeacons");
        this.forDuration(10); //1 * 3600); // Run for 1 minute
        return this;
    }
    forReliabilityTesting() {
        this.forceContinue(true);
        this.measureAs(pip_benchmark_node_2.MeasurementType.Nominal);
        this.withNominalRate(100);
        this.executeAs(pip_benchmark_node_3.ExecutionType.Proportional);
        this.withProportionalBenchmark("Beacons.CalculatePosition", 70);
        this.withProportionalBenchmark("Beacons.ReadBeacons", 10);
        this.forDuration(24 * 60 * 3600); // Run for 24 hours
        return this;
    }
    forScalabilityTesting() {
        this.forceContinue(true);
        this.measureAs(pip_benchmark_node_2.MeasurementType.Peak);
        this.executeAs(pip_benchmark_node_3.ExecutionType.Proportional);
        this.withProportionalBenchmark("Beacons.CalculatePosition", 70);
        this.withProportionalBenchmark("Beacons.ReadBeacons", 10);
        this.forDuration(15 * 3600); // Run for 15 minutes
        return this;
    }
}
exports.BeaconsBenchmarkBuilder = BeaconsBenchmarkBuilder;
//# sourceMappingURL=BeaconsBenchmarkBuilder.js.map