const _ = require('lodash');

import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams} from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IEmailSettingsClientV1 } from './IEmailSettingsClientV1';
import { EmailSettingsV1 } from './EmailSettingsV1';

export class EmailSettingsMemoryClientV1 implements IEmailSettingsClientV1 {
    private _settings: EmailSettingsV1[] = [];

    public getSettingsByIds(correlationId: string, recipientIds: string[],
        callback: (err: any, settings: EmailSettingsV1[]) => void): void {
        let settings = _.filter(this._settings, s => _.indexOf(recipientIds, s.id) >= 0);
        callback(null, settings);
    }

    public getSettingsById(correlationId: string, recipientId: string,
        callback: (err: any, settings: EmailSettingsV1) => void): void {
        let settings = _.find(this._settings, s => s.id == recipientId);
        callback(null, settings);
    }

    public getSettingsByEmailSettings(correlationId: string, email: string,
        callback: (err: any, settings: EmailSettingsV1) => void): void {
        let settings = _.find(this._settings, s => s.email == email);
        callback(null, settings);
    }

    public setSettings(correlationId: string, settings: EmailSettingsV1,
        callback?: (err: any, settings: EmailSettingsV1) => void): void {

        settings.verified = false;
        settings.subscriptions = settings.subscriptions || {};

        this._settings = _.filter(this._settings, s => s.id != settings.id);
        this._settings.push(settings);
        if (callback) callback(null, settings);
    }

    public setVerifiedSettings(correlationId: string, settings: EmailSettingsV1,
        callback?: (err: any, settings: EmailSettingsV1) => void): void {

        settings.verified = true;
        settings.subscriptions = settings.subscriptions || {};

        this._settings = _.filter(this._settings, s => s.id != settings.id);
        this._settings.push(settings);
        if (callback) callback(null, settings);
    }

    public setRecipient(correlationId: string, recipientId: string,
        name: string, email: string, language: string,
        callback?: (err: any, settings: EmailSettingsV1) => void): void {

        let settings = _.find(this._settings, s => s.id == recipientId);

        if (settings) {
            settings.name = name;
            settings.email = email;
            settings.language = language;
        } else {
            settings = <EmailSettingsV1> { 
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

    public setSubscriptions(correlationId: string, recipientId: string, subscriptions: any,
        callback?: (err: any, settings: EmailSettingsV1) => void): void {

        let settings = _.find(this._settings, s => s.id == recipientId);
        
        if (settings) {
            settings.subscriptions = subscriptions;
        } else {
            settings = <EmailSettingsV1> { 
                id: recipientId,
                name: null,
                email: null,
                language: null,
                subscriptions: subscriptions
            };
            this._settings.push(settings);
        }

        if (callback) callback(null, settings);
    }

    public deleteSettingsById(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void {
        this._settings = _.filter(this._settings, s => s.id != recipientId);
        if (callback) callback(null);
    }

    public resendVerification(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void {
        if (callback) callback(null);
    }

    public verifyEmail(correlationId: string, recipientId: string, code: string,
        callback?: (err: any) => void): void {

        let settings = _.find(this._settings, s => s.id == recipientId);

        if (settings && settings.ver_code == code) {
            settings.verified = true;
            settings.ver_code = null;
        }
            
        if (callback) callback(null);
    }

}