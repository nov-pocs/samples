let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node'; 
import { DependencyResolver } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';

import { IBeaconsClientV1 } from '../../clients/version1/IBeaconsClientV1';
import { BeaconV1 } from '../../clients/version1/BeaconV1';

export class BeaconsOperationsV1  extends RestOperations {
    private _beaconsClient: IBeaconsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('beacons', new Descriptor('nov-services-beacons', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._beaconsClient = this._dependencyResolver.getOneRequired<IBeaconsClientV1>('beacons');
    }

    public getBeacons(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        let siteId = req.params.site_id;
        filter.setAsObject('site_id', siteId);

        this._beaconsClient.getBeacons(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    public getBeacon(req: any, res: any): void {
        let siteId = req.params.site_id;
        let beaconId = req.params.beacon_id;

        this._beaconsClient.getBeaconById(
            null, beaconId, this.sendResult(req, res)
        );
    }

    public calculatePosition(req: any, res: any): void {
        let siteId = req.params.site_id;
        let udis = req.param('udis');
        if (_.isString(udis))
            udis = udis.split(',');

        this._beaconsClient.calculatePosition(
            null, siteId, udis, this.sendResult(req, res)
        );
    }
    
    public createBeacon(req: any, res: any): void {
        let siteId = req.params.site_id;
        let beacon = req.body || {};

        this._beaconsClient.createBeacon(
            null, beacon, this.sendResult(req, res)
        );
    }

    public updateBeacon(req: any, res: any): void {
        let beaconId = req.params.beacon_id;
        let siteId = req.params.site_id;
        let beacon = req.body || {};
        beacon.id = beaconId;

        this._beaconsClient.updateBeacon(
            null, beacon, this.sendResult(req, res)
        );
    }

    public deleteBeacon(req: any, res: any): void {
        let beaconId = req.params.beacon_id;
        let siteId = req.params.site_id;

        this._beaconsClient.deleteBeaconById(
            null, beaconId, this.sendResult(req, res)
        );
    }

    public validateBeaconUdi(req: any, res: any): void {
        let siteId = req.params.site_id;
        let udi = req.param('udi');

        this._beaconsClient.getBeaconByUdi(
            null, udi, (err, beacon) => {
                if (beacon) res.json(beacon.id);
                else res.json('');
            }
        );
    }
    
}