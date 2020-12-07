import { UserPasswordInfoV1 } from './UserPasswordInfoV1';
import { IPasswordsClientV1 } from './IPasswordsClientV1';

export class PasswordsNullClientV1 implements IPasswordsClientV1 {

    public getPasswordInfo(correlationId: string, userId: string,
        callback: (err: any, info: UserPasswordInfoV1) => void): void {
        callback(null, { id: userId, change_time: null, locked: false, lock_time: null });
    }

    public setTempPassword(correlationId: string, userId: string,
        callback: (err: any, password: string) => void): void {
        callback(null, '123');
    }
    
    public setPassword(correlationId: string, userId: string, password: string,
        callback: (err: any) => void): void {
        callback(null);
    }

    public deletePassword(correlationId: string, userId: string,
        callback: (err: any) => void): void {
        callback(null);
    }

    public authenticate(correlationId: string, userId: string, password: string,
        callback: (err: any, authenticated: boolean) => void): void {
        callback(null, true);
    }

    public changePassword(correlationId: string, userId: string, oldPassword: string, newPassword: string,
        callback: (err: any) => void): void {
        callback(null);
    }

    public validateCode(correlationId: string, userId: string, code: string,
        callback: (err: any, valid: boolean) => void): void {
        callback(null, true);
    }
        
    public resetPassword(correlationId: string, userId: string, code: string, password: string,
        callback: (err: any) => void): void {
        callback(null);
    }

    public recoverPassword(correlationId: string, userId: string,
        callback: (err: any) => void): void {
        callback(null);
    }

}
