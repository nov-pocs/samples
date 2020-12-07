const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { SessionV1 } from './SessionV1';
import { ISessionsClientV1 } from './ISessionsClientV1';

export class SessionsMemoryClientV1 implements ISessionsClientV1 {
    private _sessions: SessionV1[] = [];

    public getSessions(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<SessionV1>) => void): void {

        callback(null, new DataPage(this._sessions, this._sessions.length));
    }
    
    public getSessionById(correlationId: string, sessionId: string,
        callback: (err: any, session: SessionV1) => void): void {

        let session = _.find(this._sessions, (d) => d.id == sessionId);

        callback(null, session);
    }

    public openSession(correlationId: string, userId: string, userName: string,
        address: string, client: string, user: any, data: any,
        callback: (err: any, session: SessionV1) => void): void {

        let session = new SessionV1(null, userId, userName, address, client);
        session.user = user;
        session.data = data;

        this._sessions.push(session);

        callback(null, session);
    }
    
    public storeSessionData(correlationId: string, sessionId: string, data: any,
        callback: (err: any, session: SessionV1) => void): void {
        callback(null, null);
    }
    
    public updateSessionUser(correlationId: string, sessionId: string, user: any,
        callback: (err: any, session: SessionV1) => void): void {

        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            session.user = user;

        callback(null, session);
    }
    
    public closeSession(correlationId: string, sessionId: string,
        callback: (err: any, session: SessionV1) => void): void {

        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            session.active = false;
    
        callback(null, session);
    }

    public deleteSessionById(correlationId: string, sessionId: string,
        callback: (err: any, session: SessionV1) => void): void {

        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            this._sessions = _.filter(this._sessions, (d) => d.id != sessionId);
    
        callback(null, session);
    }
}
