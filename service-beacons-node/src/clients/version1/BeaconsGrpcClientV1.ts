const services = require('../../../../src/protos/beacons_v1_grpc_pb');
const messages = require('../../../../src/protos/beacons_v1_pb');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { GrpcClient } from 'pip-services3-grpc-node';

import { BeaconV1 } from '../../data/version1/BeaconV1';
import { BeaconsGrpcConverterV1 } from '../../services/version1/BeaconsGrpcConverterV1';
import { IBeaconsClientV1 } from './IBeaconsClientV1';

export class BeaconsGrpcClientV1 extends GrpcClient implements IBeaconsClientV1 {
    public constructor() {
        super(services.BeaconsV1Client);
    }

    public getBeacons(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<BeaconV1>) => void): void {

        let request = new messages.BeaconV1PageRequest();
        BeaconsGrpcConverterV1.setMap(request.getFilterMap(), filter);
        request.setPaging(BeaconsGrpcConverterV1.fromPagingParams(paging));

        let timing = this.instrument(correlationId, 'beacons.get_beacons');

        this.call(
            'get_beacons',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();

                if (err) {
                    callback(err, null);
                    return;
                }

                let page = BeaconsGrpcConverterV1.toBeaconsPage(response.getPage());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, page)
            }
        );
    }

    public getBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let request = new messages.BeaconV1IdRequest()
        request.setBeaconId(beaconId)
        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_id');
        this.call(
            'get_beacon_by_id',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();
                if (err) {
                    callback(err, null);
                }
                let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, beacon);
            }
        );
    }

    public getBeaconByUdi(correlationId: string, udi: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let request = new messages.BeaconV1UdiRequest()
        request.setBeaconUdi(udi)

        let timing = this.instrument(correlationId, 'beacons.get_beacon_by_udi');
        this.call(
            'get_beacon_by_udi',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();
                if (err) {
                    callback(err, null);
                }
                let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, beacon);
            }
        );
    }

    public calculatePosition(correlationId: string, siteId: string, udis: string[],
        callback: (err: any, position: any) => void): void {
        let request = new messages.BeaconV1PositionRequest()
        request.setSiteId(siteId)
        request.setUdisList(udis)
        let timing = this.instrument(correlationId, 'beacons.calculate_position');
        this.call(
            'calculate_position',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();
                if (err) {
                    callback(err, null);
                }
                let position = BeaconsGrpcConverterV1.toPosition(response.getPoint());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, position);
            }
        );
    }

    public createBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let request = new messages.BeaconV1ObjectRequest();
        request.setBeacon(BeaconsGrpcConverterV1.fromBeacon(beacon));

        let timing = this.instrument(correlationId, 'beacons.create_beacon');

        this.call(
            'create_beacon',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();
                if (err) {
                    callback(err, null);
                }
                let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, beacon);
            }
        );
    }

    public updateBeacon(correlationId: string, beacon: BeaconV1,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let request = new messages.BeaconV1ObjectRequest();
        request.setBeacon(BeaconsGrpcConverterV1.fromBeacon(beacon));

        let timing = this.instrument(correlationId, 'beacons.update_beacon');

        this.call(
            'update_beacon',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming();
                if (err) {
                    callback(err, null);
                }
                let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, beacon);
            }
        );
    }

    public deleteBeaconById(correlationId: string, beaconId: string,
        callback: (err: any, beacon: BeaconV1) => void): void {

        let request = new messages.BeaconV1IdRequest();
        request.setBeaconId(beaconId);

        let timing = this.instrument(correlationId, 'beacons.delete_beacon_by_id');

        this.call(
            'delete_beacon_by_id',
            correlationId,
            request,
            (err, response) => {
                timing.endTiming()
                if (err) {
                    callback(err, null);
                }
                let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());
                err = BeaconsGrpcConverterV1.toError(response.getError());
                callback(err, beacon);
            }
        );
    }
}