import { IReferences } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';
export declare class BeaconsOperationsV2 extends RestOperations {
    private _beaconsClient;
    constructor();
    setReferences(references: IReferences): void;
    getBeaconsX(req: any, res: any): void;
    getBeaconX(req: any, res: any): void;
    calculatePositionX(req: any, res: any): void;
    createBeaconX(req: any, res: any): void;
    updateBeaconX(req: any, res: any): void;
    deleteBeaconX(req: any, res: any): void;
    validateBeaconUdiX(req: any, res: any): void;
}
