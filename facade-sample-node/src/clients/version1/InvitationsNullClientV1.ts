import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { IInvitationsClientV1 } from './IInvitationsClientV1';
import { InvitationV1 } from './InvitationV1';

export class InvitationsNullClientV1 implements IInvitationsClientV1 {
    public getInvitations(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<InvitationV1>) => void): void {
        callback(null, new DataPage([], 0));
    }

    public getInvitationById(correlationId: string, invitation_id: string, 
        callback: (err: any, invitation: InvitationV1) => void): void {
        callback(null, null);
    }

    public createInvitation(correlationId: string, invitation: InvitationV1, 
        callback: (err: any, invitation: InvitationV1) => void): void {
        callback(null, invitation);
    }

    public updateInvitation(correlationId: string, invitation: InvitationV1, 
        callback: (err: any, invitation: InvitationV1) => void): void {
        callback(null, invitation);
    }

    public deleteInvitationById(correlationId: string, invitation_id: string,
        callback: (err: any, invitation: InvitationV1) => void): void {
        callback(null, null);
    }

    public activateInvitations(correlationId: string, email: string, userId: string,
        callback: (err: any, invitations: InvitationV1[]) => void) {
        callback(null, []);
    }

    public approveInvitation(correlationId: string, invitationId: string, role: string,
        callback: (err: any, invitation: InvitationV1) => void) {
        callback(null, null);
    }

    public denyInvitation(correlationId: string, invitationId: string,
        callback: (err: any, invitation: InvitationV1) => void) {
        callback(null, null);
    }
            
    public resendInvitation(correlationId: string, invitationId: string,
        callback: (err: any, invitation: InvitationV1) => void) {
        callback(null, null);
    }

    public notifyInvitation(correlationId: string, invitation: InvitationV1, 
        callback: (err: any) => void): void {
        callback(null);
    }
}