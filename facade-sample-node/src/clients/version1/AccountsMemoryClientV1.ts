let _ = require('lodash');

import { IReferences, BadRequestException } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams} from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { IAccountsClientV1 } from './IAccountsClientV1';
import { AccountV1 } from './AccountV1';

export class AccountsMemoryClientV1 implements IAccountsClientV1 {
    private _maxPageSize: number = 100;
    private _accounts: AccountV1[];

    public constructor(...accounts: AccountV1[]) {
        this._accounts = accounts;
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: AccountV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        return false;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let login = filter.getAsNullableString('login');
        let active = filter.getAsNullableBoolean('active');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        
        return (item: AccountV1) => {
            if (search != null && !this.matchSearch(item, search))
                return false;
            if (id != null && id != item.id)
                return false;
            if (name != null && name != item.name)
                return false;
            if (login != null && login != item.login)
                return false;
            if (active != null && active != item.active)
                return false;
            if (fromCreateTime != null && item.create_time >= fromCreateTime)
                return false;
            if (toCreateTime != null && item.create_time < toCreateTime)
                return false;
            if (!deleted && item.deleted) 
                return false;
            return true;
        };
    }

    public getAccounts(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<AccountV1>) => void): void {
        
        let filterCurl = this.composeFilter(filter);
        let accounts = _.filter(this._accounts, filterCurl);

        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total)
            total = accounts.length;
        
        if (skip > 0)
            accounts = _.slice(accounts, skip);
        accounts = _.take(accounts, take);
        
        let page = new DataPage<AccountV1>(accounts, total);
        callback(null, page);
    }

    public getAccountById(correlationId: string, id: string,
        callback: (err: any, account: AccountV1) => void): void {
        let accounts = this._accounts.filter((x) => {return x.id == id;});
        let account = accounts.length > 0 ? accounts[0] : null;

        callback(null, account);
    }

    public getAccountByLogin(correlationId: string, login: string,
        callback: (err: any, account: AccountV1) => void): void {
        let accounts = this._accounts.filter((x) => {return x.login == login;});
        let account = accounts.length > 0 ? accounts[0] : null;

        callback(null, account);
    }

    public getAccountByIdOrLogin(correlationId: string, idOrLogin: string,
        callback: (err: any, account: AccountV1) => void): void {
        let accounts = this._accounts.filter((x) => {return x.id == idOrLogin || x.login == idOrLogin;});
        let account = accounts.length > 0 ? accounts[0] : null;

        callback(null, account);
    }

    public createAccount(correlationId: string, account: AccountV1,
        callback: (err: any, account: AccountV1) => void): void {
        if (account == null) {
            if (callback) callback(null, null);
            return;
        }

        let accounts = this._accounts.filter((x) => {return x.id == account.id || x.login == account.login;});
        if (accounts.length > 0) {
            callback(new BadRequestException(correlationId, 'DUPLICATE_LOGIN', 'Found account with duplicate login'), null);
            return;
        }

        account = _.clone(account);
        account.id = account.id || IdGenerator.nextLong();

        this._accounts.push(account);

        if (callback) callback(null, account)
    }

    public updateAccount(correlationId: string, account: AccountV1,
        callback: (err: any, account: AccountV1) => void): void {
        let index = this._accounts.map((x) => { return x.id; }).indexOf(account.id);

        if (index < 0) {
            callback(null, null);
            return;
        }

        account = _.clone(account);
        this._accounts[index] = account;

        if (callback) callback(null, account)
    }

    public deleteAccountById(correlationId: string, id: string,
        callback: (err: any, account: AccountV1) => void): void {
        var index = this._accounts.map((x) => { return x.id; }).indexOf(id);
        var item = this._accounts[index];

        if (index < 0) {
            callback(null, null);
            return;
        }

        item.deleted = true;
        //this._accounts.splice(index, 1);

        if (callback) callback(null, item)
    }

}