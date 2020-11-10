import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { DirectClient } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

import { BeaconV1 } from '../../../src/data/version1/BeaconV1';
import { IBeaconsClientV1 } from './IBeaconsClientV1';
import { IBeaconsController } from '../../../src/logic/IBeaconsController';

export class BeaconsDirectClientV1 extends DirectClient<IBeaconsController> implements IBeaconsClientV1 {
    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('beacons', 'controller', '*', '*', '1.0'));
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        let timing = this.instrument(correlationId, 'beacons.get_beacons');
        this._controller.getBeacons(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }

    public getBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_id');
        this._controller.getBeaconById(correlationId, beaconId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public getBeaconByUdi(correlationId: string, udi: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_udi');
        this._controller.getBeaconByUdi(correlationId, udi, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public calculatePosition(correlationId: string, siteId: string, udis: string[], 
        callback: (err: any, position: any) => void): void {
        let timing = this.instrument(correlationId, 'beacons.calculate_position');
        this._controller.calculatePosition(correlationId, siteId, udis, (err, position) => {
            timing.endTiming();
            callback(err, position);
        }); 
    }

    public createBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
        let timing = this.instrument(correlationId, 'beacons.create_beacon');
        this._controller.createBeacon(correlationId, beacon, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public updateBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
        let timing = this.instrument(correlationId, 'beacons.update_beacon');
        this._controller.updateBeacon(correlationId, beacon, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }

    public deleteBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        let timing = this.instrument(correlationId, 'beacons.delete_beacon_by_id');
        this._controller.deleteBeaconById(correlationId, beaconId, (err, beacon) => {
            timing.endTiming();
            callback(err, beacon);
        }); 
    }
}