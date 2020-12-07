import { IStringIdentifiable } from 'pip-services3-commons-node';

export class InvitationV1 implements IStringIdentifiable {
    public id: string;

    public action: string;
    public site_id: string;
    public site_name?: string;
    public role?: string;

    public create_time?: Date;
    public creator_name?: string;
    public creator_id: string;

    public invitee_name?: string;
    public invitee_email?: string;
    public invitee_id?: string;

    public sent_time?: Date;
    public expire_time?: Date;
}