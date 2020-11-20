const async = require('async');
const _ = require('lodash');

import { BenchmarkSuite } from 'pip-benchmark-node';
import { Parameter } from 'pip-benchmark-node';
import { PagingParams } from 'pip-services3-commons-node';
import { RandomBeaconV1 } from '../src/data/version1/RandomBeaconV1';

import { BeaconsBenchmarkContext } from './BeaconsBenchmarkContext';
import { BeaconsCalculateBenchmark } from './BeaconsCalculateBenchmark';
import { BeaconsReadBenchmark } from './BeaconsReadBenchmark';

export class BeaconsBenchmarkSuite extends BenchmarkSuite {
    public constructor() {
        super("Beacons", "Beacons benchmark");

        this.addParameter(new Parameter('RecordCount', 'Number of records at start', '0'));        
        this.addParameter(new Parameter('SiteCount', 'Number of field sites', '100'));        
        this.addParameter(new Parameter('DatabaseType', 'Database type', 'postgres'));
        this.addParameter(new Parameter('DatabaseUri', 'Database URI', null));
        this.addParameter(new Parameter('DatabaseHost', 'Database hostname', 'localhost'));
        this.addParameter(new Parameter('DatabasePort', 'Database port', '5432'));
        this.addParameter(new Parameter('DatabaseName', 'Database name', 'test'));
        this.addParameter(new Parameter('DatabaseUser', 'Database username', 'postgres'));
        this.addParameter(new Parameter('DatabasePassword', 'Database password', 'postgres'));
        
        this.addBenchmark(new BeaconsCalculateBenchmark());
        this.addBenchmark(new BeaconsReadBenchmark());
    }

    public setUp(callback: (err: any) => void): void {
        let totalCount = this.context.parameters['RecordCount'].getAsInteger();
        let siteCount = this.context.parameters['SiteCount'].getAsInteger();
        let currentCount = 0;
        let context = new BeaconsBenchmarkContext(this.context);

        async.series([
            // Connect to the database
            (callback) => {
                context.open(callback);
            },
            // Get number of records in the database
            (callback) => {
                context.persistence.getPageByFilter(
                    null,
                    null,
                    new PagingParams(0, 1, true),
                    (err, page) => {
                        currentCount = page != null ? page.total || 0 : 0;
                        callback(err);
                    }
                )
            },
            // Generate initial records
            (callback) => {
                if (currentCount >= totalCount) {
                    callback(null);
                    return;
                }

                this.context.sendMessage("Creating " + (totalCount - currentCount) + " beacons...");

                async.whilst(
                    (callback) => {
                        if (_.isFunction(callback)) {
                            callback(null, currentCount < totalCount); 
                            return
                        } else {
                            return currentCount < totalCount;
                        }     
                    },
                    (callback) => {
                        let beacon = RandomBeaconV1.nextBeacon(siteCount);
                        context.persistence.create(null, beacon, (err, beacon) => {
                            currentCount++;

                            if (currentCount % 100 == 0) {
                                this.context.sendMessage("Created " + currentCount + " beacons");
                            }

                            callback(err);
                        });
                    },
                    (err) => {
                        this.context.sendMessage("Initial beacons successfully created.");
                        callback(err);
                    }
                )
            }
        ], (err) => {
            // Disconnect from the database
            context.close((err1) => {
                err = err || err1;
                callback(err);                
            })
        });
    }

}