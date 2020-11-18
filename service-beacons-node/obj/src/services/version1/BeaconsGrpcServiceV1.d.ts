import { IReferences } from 'pip-services3-commons-node';
import { GrpcService } from 'pip-services3-grpc-node';
export declare class BeaconsGrpcServiceV1 extends GrpcService {
    private _controller;
    constructor();
    setReferences(references: IReferences): void;
    private getBeacons;
    private getBeaconById;
    private getBeaconByUdi;
    private calculatePosition;
    private createBeacon;
    private updateBeacon;
    private deleteBeaconById;
    register(): void;
}
