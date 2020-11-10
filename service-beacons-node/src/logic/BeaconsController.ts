let _ = require('lodash');
let async = require('async');

import { FilterParams, IOpenable } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';

import { BeaconV1 } from '../../src/data/version1/BeaconV1';
import { IBeaconsPersistence } from '../../src/persistence/IBeaconsPersistence';
import { IBeaconsController } from './IBeaconsController';
import { BeaconTypeV1 } from '../../src/data/version1/BeaconTypeV1';
import { BeaconsCommandSet } from './BeaconsCommandSet';

export class BeaconsController implements IBeaconsController, IConfigurable, IReferenceable, ICommandable, IOpenable {
    private _persistence: IBeaconsPersistence;
    private _commandSet: BeaconsCommandSet;
    private _param1: string = "ABC";
    private _param2: number = 123;
    private _opened: boolean;

    public constructor() { }

    public configure(config: ConfigParams): void {
        this._param1 = config.getAsStringWithDefault("options.param1", this._param1);
        this._param2 = config.getAsIntegerWithDefault("options.param2", this._param2);

        console.log("param1=" + this._param1 + ", param2=" + this._param2);
    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<IBeaconsPersistence>(
            new Descriptor('beacons', 'persistence', '*', '*', '1.0')
        );
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new BeaconsCommandSet(this);
        }

        return this._commandSet;
    }

    public isOpen(): boolean {
        return this._opened;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        this._opened = true;
        console.log("The controlled has been opened.");
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        this._opened = true;
        console.log("The controlled has been closed.");
        callback(null);
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, page: BeaconV1) => void): void {
            this._persistence.getOneById(correlationId, beaconId, callback);
    }

    public getBeaconByUdi(correlationId: string, beaconId: string,
        callback: (err: any, page: BeaconV1) => void): void {
            this._persistence.getOneByUdi(correlationId, beaconId, callback);
    }

    public calculatePosition(correlationId: string, siteId: string, udis: string[],
        callback: (err: any, position: any) => void): void {
            let beacons: BeaconV1[];
            let position: any = null;

            if (udis == null || udis.length == 0) {
                callback(null, null);
                return;
            }

            async.series([
                (callback) => {
                    this._persistence.getPageByFilter(
                        correlationId,
                        FilterParams.fromTuples(
                            'site_id', siteId,
                            'udis', udis
                        ),
                        null,
                        (err, page) => {
                            beacons = page ? page.data : [];
                            callback(err);
                        }
                    );
                },
                (callback) => {
                    let lat = 0;
                    let lng = 0;
                    let count = 0;

                    for (let beacon of beacons) {
                        if (beacon.center != null 
                            && beacon.center.type == 'Point'
                            && _.isArray(beacon.center.coordinates)) {
                                lng += beacon.center.coordinates[0];
                                lat += beacon.center.coordinates[1];
                                count += 1;
                            }
                    }

                    if (count > 0) {
                        position = {
                            type: 'Point',
                            coordinates: [lng / count, lat / count]
                        }
                    }

                    callback();
                }
            ], (err) => { callback(err, err == null ? position : null);  });
    }

    public createBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
            beacon.id = beacon.id || IdGenerator.nextLong();
            beacon.type = beacon.type || BeaconTypeV1.Unknown;

            this._persistence.create(correlationId, beacon, callback);
    }

    public updateBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
            beacon.type = beacon.type || BeaconTypeV1.Unknown;

            this._persistence.update(correlationId, beacon, callback);
    }

    public deleteBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
            this._persistence.deleteById(correlationId, beaconId, callback);
    }

}
