import { ConfigParams, DataPage, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { CommandableGrpcClient } from 'pip-services3-grpc-node';
import { BeaconV1 } from '../..';

import { IBeaconsClientV1 } from './IBeaconsClientV1';

export class BeaconsCommandableGrpcClientV1 extends CommandableGrpcClient implements IBeaconsClientV1 {
    private _blockCount: number = 1;
    private _ids: string[] = null;

    public constructor() {
        super('beacons_v1');
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._blockCount = config.getAsIntegerWithDefault("options.block_count", this._blockCount);
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {
        this.callCommand(
            'get_beacons',
            correlationId,
            {
                filter: filter,
                paging: paging
            },
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
