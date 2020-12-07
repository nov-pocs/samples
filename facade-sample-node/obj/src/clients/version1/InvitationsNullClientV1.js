"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class InvitationsNullClientV1 {
    getInvitations(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_1.DataPage([], 0));
    }
    getInvitationById(correlationId, invitation_id, callback) {
        callback(null, null);
    }
    createInvitation(correlationId, invitation, callback) {
        callback(null, invitation);
    }
    updateInvitation(correlationId, invitation, callback) {
        callback(null, invitation);
    }
    deleteInvitationById(correlationId, invitation_id, callback) {
        callback(null, null);
    }
    activateInvitations(correlationId, email, userId, callback) {
        callback(null, []);
    }
    approveInvitation(correlationId, invitationId, role, callback) {
        callback(null, null);
    }
    denyInvitation(correlationId, invitationId, callback) {
        callback(null, null);
    }
    resendInvitation(correlationId, invitationId, callback) {
        callback(null, null);
    }
    notifyInvitation(correlationId, invitation, callback) {
        callback(null);
    }
}
exports.InvitationsNullClientV1 = InvitationsNullClientV1;
//# sourceMappingURL=InvitationsNullClientV1.js.map