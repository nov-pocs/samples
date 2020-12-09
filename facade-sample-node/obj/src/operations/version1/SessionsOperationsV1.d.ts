import { ConfigParams } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { RestOperations } from 'pip-services3-rpc-node';
import { AccountV1 } from '../../clients/version1/AccountV1';
export declare class SessionsOperationsV1 extends RestOperations {
    private static _defaultConfig1;
    private _cookie;
    private _cookieEnabled;
    private _maxCookieAge;
    private _settingsClient;
    private _accountsClient;
    private _sessionsClient;
    private _passwordsClient;
    private _rolesClient;
    private _emailSettingsClient;
    private _sitesClient;
    private _invitationsClient;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    loadSession(req: any, res: any, next: () => void): void;
    openSession(req: any, res: any, account: AccountV1, roles: string[]): void;
    signup(req: any, res: any): void;
    signupValidate(req: any, res: any): void;
    signin(req: any, res: any): void;
    signout(req: any, res: any): void;
    getSessions(req: any, res: any): void;
    restoreSession(req: any, res: any): void;
    getUserSessions(req: any, res: any): void;
    getCurrentSession(req: any, res: any): void;
    closeSession(req: any, res: any): void;
}