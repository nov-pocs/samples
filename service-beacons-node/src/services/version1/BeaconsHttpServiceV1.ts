import { CommandableHttpService } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

export class BeaconsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/beacons');
        this._dependencyResolver.put('controller', new Descriptor('beacons', 'controller', '*', '*', '1.0'));
    }
}