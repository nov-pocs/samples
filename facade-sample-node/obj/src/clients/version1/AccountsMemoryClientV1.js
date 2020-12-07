"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
class AccountsMemoryClientV1 {
    constructor(...accounts) {
        this._maxPageSize = 100;
        this._accounts = accounts;
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_2.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let login = filter.getAsNullableString('login');
        let active = filter.getAsNullableBoolean('active');
        let fromCreateTime = filter.getAsNullableDateTime('from_create_time');
        let toCreateTime = filter.getAsNullableDateTime('to_create_time');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        return (item) => {
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
    getAccounts(correlationId, filter, paging, callback) {
        let filterCurl = this.composeFilter(filter);
        let accounts = _.filter(this._accounts, filterCurl);
        // Extract a page
        paging = paging != null ? paging : new pip_services3_commons_node_3.PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let total = null;
        if (paging.total)
            total = accounts.length;
        if (skip > 0)
            accounts = _.slice(accounts, skip);
        accounts = _.take(accounts, take);
        let page = new pip_services3_commons_node_4.DataPage(accounts, total);
        callback(null, page);
    }
    getAccountById(correlationId, id, callback) {
        let accounts = this._accounts.filter((x) => { return x.id == id; });
        let account = accounts.length > 0 ? accounts[0] : null;
        callback(null, account);
    }
    getAccountByLogin(correlationId, login, callback) {
        let accounts = this._accounts.filter((x) => { return x.login == login; });
        let account = accounts.length > 0 ? accounts[0] : null;
        callback(null, account);
    }
    getAccountByIdOrLogin(correlationId, idOrLogin, callback) {
        let accounts = this._accounts.filter((x) => { return x.id == idOrLogin || x.login == idOrLogin; });
        let account = accounts.length > 0 ? accounts[0] : null;
        callback(null, account);
    }
    createAccount(correlationId, account, callback) {
        if (account == null) {
            if (callback)
                callback(null, null);
            return;
        }
        let accounts = this._accounts.filter((x) => { return x.id == account.id || x.login == account.login; });
        if (accounts.length > 0) {
            callback(new pip_services3_commons_node_1.BadRequestException(correlationId, 'DUPLICATE_LOGIN', 'Found account with duplicate login'), null);
            return;
        }
        account = _.clone(account);
        account.id = account.id || pip_services3_commons_node_5.IdGenerator.nextLong();
        this._accounts.push(account);
        if (callback)
            callback(null, account);
    }
    updateAccount(correlationId, account, callback) {
        let index = this._accounts.map((x) => { return x.id; }).indexOf(account.id);
        if (index < 0) {
            callback(null, null);
            return;
        }
        account = _.clone(account);
        this._accounts[index] = account;
        if (callback)
            callback(null, account);
    }
    deleteAccountById(correlationId, id, callback) {
        var index = this._accounts.map((x) => { return x.id; }).indexOf(id);
        var item = this._accounts[index];
        if (index < 0) {
            callback(null, null);
            return;
        }
        item.deleted = true;
        //this._accounts.splice(index, 1);
        if (callback)
            callback(null, item);
    }
}
exports.AccountsMemoryClientV1 = AccountsMemoryClientV1;
//# sourceMappingURL=AccountsMemoryClientV1.js.map