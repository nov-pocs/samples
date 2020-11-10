import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import {BeaconsServiceFactory} from '../build/BeaconsServiceFactory';

export class BeaconsProcess extends ProcessContainer{
    public constructor(){
        super('beacons', 'Beacons microservice');

        this._factories.add(new BeaconsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
    }
}