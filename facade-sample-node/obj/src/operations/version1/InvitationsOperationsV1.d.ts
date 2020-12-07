import { IReferences } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';
export declare class InvitationsOperationsV1 extends RestOperations {
    private _invitationsClient;
    constructor();
    setReferences(references: IReferences): void;
    getInvitations(req: any, res: any): void;
    getInvitation(req: any, res: any): void;
    sendInvitation(req: any, res: any): void;
    deleteInvitation(req: any, res: any): void;
    approveInvitation(req: any, res: any): void;
    denyInvitation(req: any, res: any): void;
    resendInvitation(req: any, res: any): void;
    notifyInvitation(req: any, res: any): void;
}
