import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class InvitationV1 implements IStringIdentifiable {
    id: string;
    action: string;
    site_id: string;
    site_name?: string;
    role?: string;
    create_time?: Date;
    creator_name?: string;
    creator_id: string;
    invitee_name?: string;
    invitee_email?: string;
    invitee_id?: string;
    sent_time?: Date;
    expire_time?: Date;
}
