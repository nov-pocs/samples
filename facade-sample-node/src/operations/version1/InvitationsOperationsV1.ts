const _ = require('lodash');
const async = require('async');

import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node'; 
import { RestOperations } from 'pip-services3-rpc-node';

import { IInvitationsClientV1 } from '../../clients/version1/IInvitationsClientV1';
import { InvitationV1 } from '../../clients/version1/InvitationV1';

export class InvitationsOperationsV1  extends RestOperations {
    private _invitationsClient: IInvitationsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('invitations', new Descriptor('nov-services-invitations', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._invitationsClient = this._dependencyResolver.getOneRequired<IInvitationsClientV1>('invitations');
    }

    public getInvitations(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        let siteId = req.params.site_id;
        filter.setAsObject('site_id', siteId);
        
        this._invitationsClient.getInvitations(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    public getInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;

        this._invitationsClient.getInvitationById(
            null, invitationId, this.sendResult(req, res)
        );
    }

    public sendInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitation = req.body || {};
        let user = req.user || {};

        invitation.create_time = new Date();
        invitation.creator_id = user.id;
        invitation.creator_name = user.name;

        this._invitationsClient.createInvitation(
            null, invitation, this.sendResult(req, res)
        );
    }

    public deleteInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;

        this._invitationsClient.deleteInvitationById(
            null, invitationId, this.sendResult(req, res)
        );
    }

    public approveInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        let role = req.param('role');

        this._invitationsClient.approveInvitation(
            null, invitationId, role, this.sendResult(req, res)
        );
    }

    public denyInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;

        this._invitationsClient.denyInvitation(
            null, invitationId, this.sendResult(req, res)
        );
    }
    
    public resendInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;

        this._invitationsClient.resendInvitation(
            null, invitationId, this.sendResult(req, res)
        );
    }

    public notifyInvitation(req: any, res: any): void {
        let siteId = req.params.site_id;
        let invitation = req.body || {};
        let user = req.user || {};

        invitation.create_time = new Date();
        invitation.creator_id = user.id;
        invitation.creator_name = user.name;

        this._invitationsClient.notifyInvitation(
            null, invitation, this.sendEmptyResult(req, res)
        );
    }
    
}