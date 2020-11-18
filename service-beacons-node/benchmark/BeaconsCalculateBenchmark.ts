const _ = require('lodash');
const async = require('async');

import { Benchmark } from "pip-benchmark-node";
import { FilterParams } from "pip-services3-commons-node";
import { PagingParams } from "pip-services3-commons-node";
import { RandomInteger } from "pip-services3-commons-node";

import { RandomBeaconV1 } from "../src/data/version1/RandomBeaconV1";
import { BeaconsBenchmarkContext } from "./BeaconsBenchmarkContext";

export class BeaconsCalculateBenchmark extends Benchmark {
    public _siteId: string;
    public _udis: string[] = [];
    public _beaconsContext: BeaconsBenchmarkContext;

    public constructor() {
        super("CalculatePosition", "Measures performance of calculatePosition operation");
    }

    public setUp(callback: (err: any) => void): void {
        let siteCount = this.context.parameters['SiteCount'].getAsInteger();
        this._siteId = RandomBeaconV1.nextSiteId(siteCount);

        this._beaconsContext = new BeaconsBenchmarkContext(this.context);

        async.series([
            // Connext to the database
            (callback) => {
                this._beaconsContext.open(callback);
            },
            // Get beacon udis
            (callback) => {
                this._beaconsContext.persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        "site_id", this._siteId
                    ),
                    new PagingParams(0, 100, false),
                    (err, page) => {
                        if (page != null) {
                            this._udis = _.map(page.data, b => b.udi);
                        }
                        callback(err);
                    }
                )
            }
        ], callback);
    }

    public tearDown(callback: (err: any) => void): void {
        // Disconnect from the database
        this._beaconsContext.close(callback);
    }

    private nextUdis(): string[] {
        let udiCount = RandomInteger.nextInteger(0, 10);
        let remainingUdis = [...this._udis];
        let udis = [];
        while (udiCount > 0 && remainingUdis.length > 0) {
            let index = RandomInteger.nextInteger(0, remainingUdis.length - 1);
            udis.push(remainingUdis[index]);
            remainingUdis.splice(index, 1);
        }
        return udis;
    }

    public execute(callback: (err: any) => void): void {
        let udis = this.nextUdis();
        this._beaconsContext.controller.calculatePosition(
            null, this._siteId, udis,
            callback
        );
    }
}