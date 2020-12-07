import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { InvitationV1 } from './InvitationV1';
export interface IInvitationsClientV1 {
    getInvitations(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<InvitationV1>) => void): void;
    getInvitationById(correlationId: string, invitation_id: string, callback: (err: any, invitation: InvitationV1) => void): void;
    createInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any, invitation: InvitationV1) => void): void;
    updateInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any, invitation: InvitationV1) => void): void;
    deleteInvitationById(correlationId: string, invitation_id: string, callback: (err: any, invitation: InvitationV1) => void): void;
    activateInvitations(correlationId: string, email: string, userId: string, callback: (err: any, invitations: InvitationV1[]) => void): any;
    approveInvitation(correlationId: string, invitationId: string, role: string, callback: (err: any, invitation: InvitationV1) => void): any;
    denyInvitation(correlationId: string, invitationId: string, callback: (err: any, invitation: InvitationV1) => void): any;
    resendInvitation(correlationId: string, invitationId: string, callback: (err: any, invitation: InvitationV1) => void): any;
    notifyInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any) => void): void;
}
