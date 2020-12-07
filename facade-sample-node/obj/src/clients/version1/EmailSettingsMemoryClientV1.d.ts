import { IEmailSettingsClientV1 } from './IEmailSettingsClientV1';
import { EmailSettingsV1 } from './EmailSettingsV1';
export declare class EmailSettingsMemoryClientV1 implements IEmailSettingsClientV1 {
    private _settings;
    getSettingsByIds(correlationId: string, recipientIds: string[], callback: (err: any, settings: EmailSettingsV1[]) => void): void;
    getSettingsById(correlationId: string, recipientId: string, callback: (err: any, settings: EmailSettingsV1) => void): void;
    getSettingsByEmailSettings(correlationId: string, email: string, callback: (err: any, settings: EmailSettingsV1) => void): void;
    setSettings(correlationId: string, settings: EmailSettingsV1, callback?: (err: any, settings: EmailSettingsV1) => void): void;
    setVerifiedSettings(correlationId: string, settings: EmailSettingsV1, callback?: (err: any, settings: EmailSettingsV1) => void): void;
    setRecipient(correlationId: string, recipientId: string, name: string, email: string, language: string, callback?: (err: any, settings: EmailSettingsV1) => void): void;
    setSubscriptions(correlationId: string, recipientId: string, subscriptions: any, callback?: (err: any, settings: EmailSettingsV1) => void): void;
    deleteSettingsById(correlationId: string, recipientId: string, callback?: (err: any) => void): void;
    resendVerification(correlationId: string, recipientId: string, callback?: (err: any) => void): void;
    verifyEmail(correlationId: string, recipientId: string, code: string, callback?: (err: any) => void): void;
}
