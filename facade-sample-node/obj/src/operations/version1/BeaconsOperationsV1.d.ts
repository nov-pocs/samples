import { IReferences } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';
export declare class BeaconsOperationsV1 extends RestOperations {
    private _beaconsClient;
    constructor();
    setReferences(references: IReferences): void;
    getBeacons(req: any, res: any): void;
    getBeacon(req: any, res: any): void;
    calculatePosition(req: any, res: any): void;
    createBeacon(req: any, res: any): void;
    updateBeacon(req: any, res: any): void;
    deleteBeacon(req: any, res: any): void;
    validateBeaconUdi(req: any, res: any): void;
}
