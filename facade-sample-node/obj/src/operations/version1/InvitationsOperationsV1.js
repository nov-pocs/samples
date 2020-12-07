"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class InvitationsOperationsV1 extends pip_services3_rpc_node_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('invitations', new pip_services3_commons_node_1.Descriptor('nov-services-invitations', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._invitationsClient = this._dependencyResolver.getOneRequired('invitations');
    }
    getInvitations(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let siteId = req.params.site_id;
        filter.setAsObject('site_id', siteId);
        this._invitationsClient.getInvitations(null, filter, paging, this.sendResult(req, res));
    }
    getInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        this._invitationsClient.getInvitationById(null, invitationId, this.sendResult(req, res));
    }
    sendInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitation = req.body || {};
        let user = req.user || {};
        invitation.create_time = new Date();
        invitation.creator_id = user.id;
        invitation.creator_name = user.name;
        this._invitationsClient.createInvitation(null, invitation, this.sendResult(req, res));
    }
    deleteInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        this._invitationsClient.deleteInvitationById(null, invitationId, this.sendResult(req, res));
    }
    approveInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        let role = req.param('role');
        this._invitationsClient.approveInvitation(null, invitationId, role, this.sendResult(req, res));
    }
    denyInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        this._invitationsClient.denyInvitation(null, invitationId, this.sendResult(req, res));
    }
    resendInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitationId = req.params.invitation_id;
        this._invitationsClient.resendInvitation(null, invitationId, this.sendResult(req, res));
    }
    notifyInvitation(req, res) {
        let siteId = req.params.site_id;
        let invitation = req.body || {};
        let user = req.user || {};
        invitation.create_time = new Date();
        invitation.creator_id = user.id;
        invitation.creator_name = user.name;
        this._invitationsClient.notifyInvitation(null, invitation, this.sendEmptyResult(req, res));
    }
}
exports.InvitationsOperationsV1 = InvitationsOperationsV1;
//# sourceMappingURL=InvitationsOperationsV1.js.map