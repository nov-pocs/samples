"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
class EmailSettingsMemoryClientV1 {
    constructor() {
        this._settings = [];
    }
    getSettingsByIds(correlationId, recipientIds, callback) {
        let settings = _.filter(this._settings, s => _.indexOf(recipientIds, s.id) >= 0);
        callback(null, settings);
    }
    getSettingsById(correlationId, recipientId, callback) {
        let settings = _.find(this._settings, s => s.id == recipientId);
        callback(null, settings);
    }
    getSettingsByEmailSettings(correlationId, email, callback) {
        let settings = _.find(this._settings, s => s.email == email);
        callback(null, settings);
    }
    setSettings(correlationId, settings, callback) {
        settings.verified = false;
        settings.subscriptions = settings.subscriptions || {};
        this._settings = _.filter(this._settings, s => s.id != settings.id);
        this._settings.push(settings);
        if (callback)
            callback(null, settings);
    }
    setVerifiedSettings(correlationId, settings, callback) {
        settings.verified = true;
        settings.subscriptions = settings.subscriptions || {};
        this._settings = _.filter(this._settings, s => s.id != settings.id);
        this._settings.push(settings);
        if (callback)
            callback(null, settings);
    }
    setRecipient(correlationId, recipientId, name, email, language, callback) {
        let settings = _.find(this._settings, s => s.id == recipientId);
        if (settings) {
            settings.name = name;
            settings.email = email;
            settings.language = language;
        }
        else {
            settings = {
                id: recipientId,
                name: name,
                email: email,
                language: language,
                verified: false,
                subscriptions: {}
            };
            this._settings.push(settings);
        }
        callback(null, settings);
    }
    setSubscriptions(correlationId, recipientId, subscriptions, callback) {
        let settings = _.find(this._settings, s => s.id == recipientId);
        if (settings) {
            settings.subscriptions = subscriptions;
        }
        else {
            settings = {
                id: recipientId,
                name: null,
                email: null,
                language: null,
                subscriptions: subscriptions
            };
            this._settings.push(settings);
        }
        if (callback)
            callback(null, settings);
    }
    deleteSettingsById(correlationId, recipientId, callback) {
        this._settings = _.filter(this._settings, s => s.id != recipientId);
        if (callback)
            callback(null);
    }
    resendVerification(correlationId, recipientId, callback) {
        if (callback)
            callback(null);
    }
    verifyEmail(correlationId, recipientId, code, callback) {
        let settings = _.find(this._settings, s => s.id == recipientId);
        if (settings && settings.ver_code == code) {
            settings.verified = true;
            settings.ver_code = null;
        }
        if (callback)
            callback(null);
    }
}
exports.EmailSettingsMemoryClientV1 = EmailSettingsMemoryClientV1;
//# sourceMappingURL=EmailSettingsMemoryClientV1.js.map