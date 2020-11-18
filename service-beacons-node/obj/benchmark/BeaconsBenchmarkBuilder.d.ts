import { ConsoleBenchmarkBuilder } from 'pip-benchmark-node';
export declare class BeaconsBenchmarkBuilder extends ConsoleBenchmarkBuilder {
    constructor();
    private setEnvParameters;
    forPerformanceTesting(): BeaconsBenchmarkBuilder;
    forReliabilityTesting(): BeaconsBenchmarkBuilder;
    forScalabilityTesting(): BeaconsBenchmarkBuilder;
}
