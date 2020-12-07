"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class SitesOperationsV1 extends pip_services3_rpc_node_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('roles', new pip_services3_commons_node_2.Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services3_commons_node_2.Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sites', new pip_services3_commons_node_2.Descriptor('nov-services-sites', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._rolesClient = this._dependencyResolver.getOneRequired('roles');
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
        this._sitesClient = this._dependencyResolver.getOneRequired('sites');
    }
    getSites(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        this._sitesClient.getSites(null, filter, paging, this.sendResult(req, res));
    }
    getAuthorizedSites(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let roles = req.user ? req.user.roles || [] : [];
        let siteIds = [];
        // Get authorized site ids
        for (let role of roles) {
            let tokens = role.split(':');
            if (tokens.length == 2)
                siteIds.push(tokens[0]);
        }
        // Consider ids parameter
        let oldSiteIds = filter.get('ids');
        if (oldSiteIds)
            siteIds = _.intersection(oldSiteIds, siteIds);
        // Is user has no sites then exit
        if (siteIds.length == 0) {
            res.json(res.json(new pip_services3_commons_node_1.DataPage([])));
            return;
        }
        filter.setAsObject('ids', siteIds);
        this._sitesClient.getSites(null, filter, paging, this.sendResult(req, res));
    }
    getSite(req, res) {
        let siteId = req.params.site_id;
        this._sitesClient.getSiteById(null, siteId, this.sendResult(req, res));
    }
    findSiteByCode(req, res) {
        let code = req.param('code');
        this._sitesClient.getSiteByCode(null, code, this.sendResult(req, res));
    }
    generateCode(req, res) {
        let siteId = req.params.site_id;
        this._sitesClient.generateCode(null, siteId, this.sendResult(req, res));
    }
    createSite(req, res) {
        let data = req.body || {};
        let site;
        async.series([
            // Create a site
            (callback) => {
                this._sitesClient.createSite(null, data, (err, data) => {
                    site = data;
                    callback(err);
                });
            },
            // Assign permissions to the owner
            (callback) => {
                if (this._rolesClient != null && req.user_id != null)
                    this._rolesClient.grantRoles(null, req.user_id, [site.id + ':admin'], callback);
                else
                    callback();
            },
            // Update current user session
            (callback) => {
                if (req.user != null && req.session_id != null) {
                    let user = req.user;
                    user.roles = user.roles || [];
                    user.roles.push(site.id + ':admin');
                    user.sites = user.sites || [];
                    user.sites.push(site);
                    this._sessionsClient.updateSessionUser(null, req.session_id, user, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(site);
        });
    }
    updateSite(req, res) {
        let siteId = req.params.site_id;
        let data = req.body || {};
        data.id = siteId;
        let site;
        async.series([
            // Update site
            (callback) => {
                this._sitesClient.updateSite(null, data, (err, data) => {
                    site = data;
                    callback(err);
                });
            },
            // Update current user session
            (callback) => {
                if (req.user != null && req.session_id != null) {
                    let user = req.user;
                    user.sites = user.sites || [];
                    user.sites = _.filter(user.sites, s => s.id != site.id);
                    user.sites.push(site);
                    this._sessionsClient.updateSessionUser(null, req.session_id, user, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                res.json(site);
        });
    }
    deleteSite(req, res) {
        let siteId = req.params.site_id;
        this._sitesClient.deleteSiteById(null, siteId, this.sendResult(req, res));
    }
    removeSite(req, res) {
        let siteId = req.params.site_id;
        async.series([
            // Assign permissions to the owner
            (callback) => {
                if (this._rolesClient != null && req.user_id != null) {
                    this._rolesClient.revokeRoles(null, req.user_id, [
                        siteId + ':admin',
                        siteId + ':manager',
                        siteId + ':user'
                    ], callback);
                }
                else
                    callback();
            },
            // Update current user session
            (callback) => {
                if (req.user != null && req.session_id != null) {
                    let user = req.user;
                    user.roles = user.roles || [];
                    user.roles = _.filter(user.roles, r => r != siteId + ':admin');
                    user.roles = _.filter(user.roles, r => r != siteId + ':manager');
                    user.roles = _.filter(user.roles, r => r != siteId + ':user');
                    user.sites = user.sites || [];
                    user.sites = _.filter(user.sites, s => s.id != siteId);
                    this._sessionsClient.updateSessionUser(null, req.session_id, user, callback);
                }
                else
                    callback();
            }
        ], (err) => {
            this.sendEmptyResult(req, res)(err);
        });
    }
    validateSiteCode(req, res) {
        let code = req.param('code');
        this._sitesClient.getSiteByCode(null, code, (err, site) => {
            if (site)
                res.json(site.id);
            else
                res.json('');
        });
    }
}
exports.SitesOperationsV1 = SitesOperationsV1;
//# sourceMappingURL=SitesOperationsV1.js.map