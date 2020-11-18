import { ConsoleBenchmarkBuilder } from 'pip-benchmark-node';
import { MeasurementType } from 'pip-benchmark-node';
import { ExecutionType } from 'pip-benchmark-node';

import { BeaconsBenchmarkSuite } from './BeaconsBenchmarkSuite';

export class BeaconsBenchmarkBuilder extends ConsoleBenchmarkBuilder {
    public constructor() {
        super();

        this.addSuite(new BeaconsBenchmarkSuite());
        this.setEnvParameters();

    }

    private setEnvParameters(): BeaconsBenchmarkBuilder {
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

    public forPerformanceTesting(): BeaconsBenchmarkBuilder {
        this.forceContinue(false);
        this.measureAs(MeasurementType.Peak);
        this.executeAs(ExecutionType.Sequential);

        this.withBenchmark("Beacons.CalculatePosition");
        this.withBenchmark("Beacons.ReadBeacons");

        this.forDuration(10); //1 * 3600); // Run for 1 minute

        return this;
    }

    public forReliabilityTesting(): BeaconsBenchmarkBuilder {
        this.forceContinue(true);
        this.measureAs(MeasurementType.Nominal);
        this.withNominalRate(100);
        this.executeAs(ExecutionType.Proportional);

        this.withProportionalBenchmark("Beacons.CalculatePosition", 70);
        this.withProportionalBenchmark("Beacons.ReadBeacons", 10);

        this.forDuration(24 * 60 * 3600); // Run for 24 hours

        return this;
    }

    public forScalabilityTesting(): BeaconsBenchmarkBuilder {
        this.forceContinue(true);
        this.measureAs(MeasurementType.Peak);
        this.executeAs(ExecutionType.Proportional);

        this.withProportionalBenchmark("Beacons.CalculatePosition", 70);
        this.withProportionalBenchmark("Beacons.ReadBeacons", 10);

        this.forDuration(15 * 3600); // Run for 15 minutes

        return this;
    }

}