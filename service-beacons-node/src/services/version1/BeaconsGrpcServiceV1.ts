const services = require('../../../../src/protos/beacons_v1_grpc_pb');
const messages = require('../../../../src/protos/beacons_v1_pb');

import { ArraySchema, FilterParams, FilterParamsSchema, IReferences, PagingParams, PagingParamsSchema } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { GrpcService } from 'pip-services3-grpc-node';

import { IBeaconsController } from '../../logic/IBeaconsController';
import { BeaconsGrpcConverterV1 } from './BeaconsGrpcConverterV1';

export class BeaconsGrpcServiceV1 extends GrpcService {

    private _controller: IBeaconsController;

    public constructor() {
        super(services.BeaconsV1Service);
        this._dependencyResolver.put('controller', new Descriptor("beacons", "controller", "default", "*", "*"));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IBeaconsController>('controller');
    }

    private getBeacons(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let filter = new FilterParams();
        BeaconsGrpcConverterV1.setMap(filter, call.request.getFilterMap());
        let paging = BeaconsGrpcConverterV1.toPagingParams(call.request.getPaging());

        this._controller.getBeacons(
            correlationId,
            filter,
            paging,
            (err, page) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1PageReply();
                response.setError(error);
                response.setPage(BeaconsGrpcConverterV1.fromBeaconsPage(page));

                callback(err, response);
            }
        );
    }

    private getBeaconById(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let beaconId = call.request.getBeaconId();

        this._controller.getBeaconById(
            correlationId,
            beaconId,
            (err, values) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1ObjectReply();
                response.setError(error);
                response.setBeacon(BeaconsGrpcConverterV1.fromBeacon(values));

                callback(err, response);
            }
        );
    }

    private getBeaconByUdi(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let udi = call.request.getBeaconUdi();

        this._controller.getBeaconByUdi(
            correlationId,
            udi,
            (err, values) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1ObjectReply();
                response.setError(error);
                response.setBeacon(BeaconsGrpcConverterV1.fromBeacon(values));

                callback(err, response);
            }
        );

    }

    private calculatePosition(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let siteId = call.request.getSiteId();
        let udis = call.request.getUdisList();

        this._controller.calculatePosition(
            correlationId,
            siteId,
            udis,
            (err, value) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1PositionReply();
                response.setError(error);
                response.setPoint(BeaconsGrpcConverterV1.fromPosition(value));

                callback(err, response);
            }
        );
    }

    private createBeacon(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let beacon = BeaconsGrpcConverterV1.toBeacon(call.request.getBeacon());

        this._controller.createBeacon(
            correlationId,
            beacon,
            (err, values) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1ObjectReply();
                response.setError(error);
                response.setBeacon(BeaconsGrpcConverterV1.fromBeacon(values));

                callback(err, response);
            }
        );

    }

    private updateBeacon(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let beacon = BeaconsGrpcConverterV1.toBeacon(call.request.getBeacon());

        this._controller.updateBeacon(
            correlationId,
            beacon,
            (err, values) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1ObjectReply();
                response.setError(error);
                response.setBeacon(BeaconsGrpcConverterV1.fromBeacon(values));

                callback(err, response);
            }
        );

    }

    private deleteBeaconById(call: any, callback: any) {

        let correlationId = call.request.getCorrelationId();
        let beaconId = call.request.getBeaconId();

        this._controller.deleteBeaconById(
            correlationId,
            beaconId,
            (err, values) => {
                let error = BeaconsGrpcConverterV1.fromError(err);

                let response = new messages.BeaconV1ObjectReply();
                response.setError(error);
                response.setBeacon(BeaconsGrpcConverterV1.fromBeacon(values));

                callback(err, response);
            }
        );

    }

    register(): void {
        this.registerMethod(
            'get_beacons',
            new ObjectSchema(true)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            this.getBeacons
        );

        this.registerMethod(
            'get_beacon_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('beaconId', TypeCode.String),
            this.getBeaconById
        );

        this.registerMethod(
            'get_beacon_by_udi',
            new ObjectSchema(true)
                .withRequiredProperty('beaconUdi', TypeCode.String),
            this.getBeaconByUdi
        );

        this.registerMethod(
            'calculate_position',
            new ObjectSchema(true)
                .withRequiredProperty('siteId', TypeCode.String)
                .withRequiredProperty('udisList', new ArraySchema(TypeCode.String)),
            this.calculatePosition
        );

        this.registerMethod(
            'create_beacon',
            null,
            this.createBeacon
        );

        this.registerMethod(
            'update_beacon',
            null,
            this.updateBeacon
        );

        this.registerMethod(
            'delete_beacon_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('beaconId', TypeCode.String),
            this.deleteBeaconById
        );
    }

}
