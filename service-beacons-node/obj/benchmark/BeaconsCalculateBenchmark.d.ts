import { Benchmark } from "pip-benchmark-node";
import { BeaconsBenchmarkContext } from "./BeaconsBenchmarkContext";
export declare class BeaconsCalculateBenchmark extends Benchmark {
    _siteId: string;
    _udis: string[];
    _beaconsContext: BeaconsBenchmarkContext;
    constructor();
    setUp(callback: (err: any) => void): void;
    tearDown(callback: (err: any) => void): void;
    private nextUdis;
    execute(callback: (err: any) => void): void;
}
