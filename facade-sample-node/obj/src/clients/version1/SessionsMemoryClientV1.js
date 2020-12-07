"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const SessionV1_1 = require("./SessionV1");
class SessionsMemoryClientV1 {
    constructor() {
        this._sessions = [];
    }
    getSessions(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_1.DataPage(this._sessions, this._sessions.length));
    }
    getSessionById(correlationId, sessionId, callback) {
        let session = _.find(this._sessions, (d) => d.id == sessionId);
        callback(null, session);
    }
    openSession(correlationId, userId, userName, address, client, user, data, callback) {
        let session = new SessionV1_1.SessionV1(null, userId, userName, address, client);
        session.user = user;
        session.data = data;
        this._sessions.push(session);
        callback(null, session);
    }
    storeSessionData(correlationId, sessionId, data, callback) {
        callback(null, null);
    }
    updateSessionUser(correlationId, sessionId, user, callback) {
        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            session.user = user;
        callback(null, session);
    }
    closeSession(correlationId, sessionId, callback) {
        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            session.active = false;
        callback(null, session);
    }
    deleteSessionById(correlationId, sessionId, callback) {
        let session = _.find(this._sessions, (d) => d.id == sessionId);
        if (session)
            this._sessions = _.filter(this._sessions, (d) => d.id != sessionId);
        callback(null, session);
    }
}
exports.SessionsMemoryClientV1 = SessionsMemoryClientV1;
//# sourceMappingURL=SessionsMemoryClientV1.js.map