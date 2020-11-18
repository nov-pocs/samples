import { IExecutionContext } from 'pip-benchmark-node';
import { IBeaconsPersistence } from '../src/persistence/IBeaconsPersistence';
import { BeaconsController } from '../src/logic/BeaconsController';
export declare class BeaconsBenchmarkContext {
    private _baseContext;
    persistence: IBeaconsPersistence;
    controller: BeaconsController;
    constructor(baseContext: IExecutionContext);
    open(callback: (err: any) => void): void;
    close(callback: (err: any) => void): void;
}
