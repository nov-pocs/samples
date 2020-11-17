import { Descriptor } from 'pip-services3-commons-node';
import { CommandableGrpcService } from 'pip-services3-grpc-node';

export class BeaconsCommandableGrpcServiceV1 extends CommandableGrpcService {
    public constructor() {
        super('beacons_v1');
        this._dependencyResolver.put('controller', new Descriptor('beacons', 'controller', 'default', '*', '*'));
    }
}