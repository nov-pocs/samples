const _ = require('lodash');
const async = require('async');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { BeaconV1 } from './BeaconV1';
import { IBeaconsClientV1 } from './IBeaconsClientV1';

export class BeaconsMemoryClientV1 implements IBeaconsClientV1 {
    private _beacons: BeaconV1[] = [];

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let siteId = filter.getAsNullableString('site_id');
        let label = filter.getAsNullableString('label');
        let udi = filter.getAsNullableString('udi');
        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (!_.isArray(udis))
            udis = null;

        return (item) => {
            if (id != null && item.id != id)
                return false;
            if (siteId != null && item.site_id != siteId)
                return false;
            if (label != null && item.label != label)
                return false;
            if (udi != null && item.udi != udi)
                return false;
            if (udis != null && _.indexOf(udis, item.udi) < 0)
                return false;
            return true;
        };
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {

        let beacons = _.filter(this._beacons, this.composeFilter(filter));

        callback(null, new DataPage<BeaconV1>(beacons, beacons.length));
    }

    public getBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let beacon = _.find(this._beacons, (d) => d.id == beaconId);

        callback(null, beacon);
    }

    public getBeaconByUdi(correlationId: string, udi: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let beacon = _.find(this._beacons, (item) => item.udi == udi);

        callback(null, beacon);
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
                this.getBeacons(
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
        beacon.type = beacon.type || "unknown";

        this._beacons.push(beacon);

        callback(null, beacon);
    }

    public updateBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
        beacon.type = beacon.type || "unknown";

        this._beacons = _.filter(this._beacons, (d) => d.id != beacon.id);
        this._beacons.push(beacon);
        
        callback(null, beacon);
    }

    public deleteBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let beacon = _.find(this._beacons, (d) => d.id == beaconId);
        if (beacon)
            this._beacons = _.filter(this._beacons, (d) => d.id != beacon.id);
        
        callback(null, beacon);
    }

}