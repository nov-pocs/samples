import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IAccountsClientV1 } from './IAccountsClientV1';
import { AccountV1 } from './AccountV1';
export declare class AccountsMemoryClientV1 implements IAccountsClientV1 {
    private _maxPageSize;
    private _accounts;
    constructor(...accounts: AccountV1[]);
    private matchString;
    private matchSearch;
    private composeFilter;
    getAccounts(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<AccountV1>) => void): void;
    getAccountById(correlationId: string, id: string, callback: (err: any, account: AccountV1) => void): void;
    getAccountByLogin(correlationId: string, login: string, callback: (err: any, account: AccountV1) => void): void;
    getAccountByIdOrLogin(correlationId: string, idOrLogin: string, callback: (err: any, account: AccountV1) => void): void;
    createAccount(correlationId: string, account: AccountV1, callback: (err: any, account: AccountV1) => void): void;
    updateAccount(correlationId: string, account: AccountV1, callback: (err: any, account: AccountV1) => void): void;
    deleteAccountById(correlationId: string, id: string, callback: (err: any, account: AccountV1) => void): void;
}
