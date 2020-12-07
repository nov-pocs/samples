import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IInvitationsClientV1 } from './IInvitationsClientV1';
import { InvitationV1 } from './InvitationV1';
export declare class InvitationsNullClientV1 implements IInvitationsClientV1 {
    getInvitations(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<InvitationV1>) => void): void;
    getInvitationById(correlationId: string, invitation_id: string, callback: (err: any, invitation: InvitationV1) => void): void;
    createInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any, invitation: InvitationV1) => void): void;
    updateInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any, invitation: InvitationV1) => void): void;
    deleteInvitationById(correlationId: string, invitation_id: string, callback: (err: any, invitation: InvitationV1) => void): void;
    activateInvitations(correlationId: string, email: string, userId: string, callback: (err: any, invitations: InvitationV1[]) => void): void;
    approveInvitation(correlationId: string, invitationId: string, role: string, callback: (err: any, invitation: InvitationV1) => void): void;
    denyInvitation(correlationId: string, invitationId: string, callback: (err: any, invitation: InvitationV1) => void): void;
    resendInvitation(correlationId: string, invitationId: string, callback: (err: any, invitation: InvitationV1) => void): void;
    notifyInvitation(correlationId: string, invitation: InvitationV1, callback: (err: any) => void): void;
}
