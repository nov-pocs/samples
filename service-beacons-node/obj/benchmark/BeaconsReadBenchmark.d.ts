import { Benchmark } from "pip-benchmark-node";
import { BeaconsBenchmarkContext } from "./BeaconsBenchmarkContext";
export declare class BeaconsReadBenchmark extends Benchmark {
    _siteCount: number;
    _beaconsContext: BeaconsBenchmarkContext;
    constructor();
    setUp(callback: (err: any) => void): void;
    tearDown(callback: (err: any) => void): void;
    execute(callback: (err: any) => void): void;
}
