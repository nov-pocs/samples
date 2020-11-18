import { Benchmark } from "pip-benchmark-node";
import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";
import { RandomInteger } from "pip-services3-commons-node";

import { BeaconsBenchmarkContext } from "./BeaconsBenchmarkContext";

export class BeaconsReadBenchmark extends Benchmark {
    public _siteCount: number;
    public _beaconsContext: BeaconsBenchmarkContext;

    public constructor() {
        super("ReadBeacons", "Measures performance of getBeacons operation");
    }

    public setUp(callback: (err: any) => void): void {
        this._siteCount = this.context.parameters['SiteCount'].getAsInteger();
        this._beaconsContext = new BeaconsBenchmarkContext(this.context);

        // Connext to the database
        this._beaconsContext.open(callback);
    }

    public tearDown(callback: (err: any) => void): void {
        // Disconnect from the database
        this._beaconsContext.close(callback);
    }

    public execute(callback: (err: any) => void): void {
        let siteId = RandomInteger.nextInteger(1, this._siteCount).toString();
        this._beaconsContext.controller.getBeacons(
            null,
            FilterParams.fromTuples(
                'site_id', siteId
            ),
            new PagingParams(0, 100, false),
            callback
        );
    }
}