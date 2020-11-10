import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { CommandableHttpClient } from 'pip-services3-rpc-node';

import { BeaconV1 } from '../../../src/data/version1/BeaconV1';
import { IBeaconsClientV1 } from './IBeaconsClientV1';

export class BeaconsHttpClientV1 extends CommandableHttpClient implements IBeaconsClientV1 {
    public constructor() {
        super('v1/beacons');
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        this.callCommand(
            'get_beacons',
            correlationId,
            { filter: filter, paging: paging },
            callback
        );
    }

    public getBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        this.callCommand(
            'get_beacon_by_id',
            correlationId,
            {
                beacon_id: beaconId
            },
            callback
        );
    }

    public getBeaconByUdi(correlationId: string, udi: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        this.callCommand(
            'get_beacon_by_udi',
            correlationId,
            {
                udi: udi
            },
            callback
        );
    }

    public calculatePosition(correlationId: string, siteId: string, udis: string[], 
        callback: (err: any, position: any) => void): void {
        this.callCommand(
            'calculate_position',
            correlationId,
            {
                site_id: siteId,
                udis: udis
            },
            callback
        );    
    }

    public createBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
        this.callCommand(
            'create_beacon',
            correlationId,
            {
                beacon: beacon
            },
            callback
        );
    }

    public updateBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {
        this.callCommand(
            'update_beacon',
            correlationId,
            {
                beacon: beacon
            },
            callback
        );    
    }

    public deleteBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {
        this.callCommand(
            'delete_beacon_by_id',
            correlationId,
            {
                beacon_id: beaconId
            },
            callback
        );
    }
}