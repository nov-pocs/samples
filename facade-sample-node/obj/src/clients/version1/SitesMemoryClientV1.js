"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
class SitesMemoryClientV1 {
    constructor() {
        this._sites = [];
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
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let code = filter.getAsNullableString('code');
        let active = filter.getAsNullableBoolean('active');
        let deleted = filter.getAsBooleanWithDefault('deleted', false);
        return (item) => {
            if (id && item.id != id)
                return false;
            if (code && item.code != code)
                return false;
            if (active && item.active != active)
                return false;
            if (!deleted && item.deleted)
                return false;
            if (search && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getSites(correlationId, filter, paging, callback) {
        let sites = _.filter(this._sites, this.composeFilter(filter));
        callback(null, new pip_services3_commons_node_2.DataPage(sites, sites.length));
    }
    getSiteById(correlationId, siteId, callback) {
        let site = _.find(this._sites, (d) => d.id == siteId);
        callback(null, site);
    }
    getSiteByCode(correlationId, code, callback) {
        let site = _.find(this._sites, (d) => d.code == code);
        callback(null, site);
    }
    generateCode(correlationId, siteId, callback) {
        callback(null, siteId);
    }
    createSite(correlationId, site, callback) {
        site.id = site.id || pip_services3_commons_node_3.IdGenerator.nextLong();
        site.create_time = new Date();
        site.active = site.active != null || true;
        this._sites.push(site);
        callback(null, site);
    }
    updateSite(correlationId, site, callback) {
        this._sites = _.filter(this._sites, (d) => d.id != site.id);
        this._sites.push(site);
        callback(null, site);
    }
    deleteSiteById(correlationId, siteId, callback) {
        let site = _.find(this._sites, (d) => d.id == siteId);
        if (site) {
            site.deleted = true;
        }
        callback(null, site);
    }
}
exports.SitesMemoryClientV1 = SitesMemoryClientV1;
//# sourceMappingURL=SitesMemoryClientV1.js.map