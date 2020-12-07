const _ = require('lodash');
const async = require('async');

import { DataPage } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node'; 
import { RestOperations } from 'pip-services3-rpc-node';

import { ISitesClientV1 } from '../../clients/version1/ISitesClientV1';
import { SiteV1 } from '../../clients/version1/SiteV1';
import { IRolesClientV1 } from '../../clients/version1/IRolesClientV1';
import { ISessionsClientV1 } from '../../clients/version1/ISessionsClientV1';

export class SitesOperationsV1  extends RestOperations {
    private _rolesClient: IRolesClientV1;
    private _sessionsClient: ISessionsClientV1;
    private _sitesClient: ISitesClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('roles', new Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sites', new Descriptor('nov-services-sites', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._rolesClient = this._dependencyResolver.getOneRequired<IRolesClientV1>('roles');
        this._sessionsClient = this._dependencyResolver.getOneRequired<ISessionsClientV1>('sessions');
        this._sitesClient = this._dependencyResolver.getOneRequired<ISitesClientV1>('sites');
    }

    public getSites(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        this._sitesClient.getSites(
            null, filter, paging, this.sendResult(req, res)
        );
    }

    public getAuthorizedSites(req: any, res: any): void {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        let roles: string[] = req.user ? req.user.roles || [] : [];
        let siteIds: string[] = [];

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
            res.json(res.json(new DataPage([])));
            return;
        }

        filter.setAsObject('ids', siteIds);

        this._sitesClient.getSites(
            null, filter, paging, this.sendResult(req, res)
        );
    }
    
    public getSite(req: any, res: any): void {
        let siteId = req.params.site_id;

        this._sitesClient.getSiteById(
            null, siteId, this.sendResult(req, res)
        );
    }

    public findSiteByCode(req: any, res: any): void {
        let code = req.param('code');

        this._sitesClient.getSiteByCode(
            null, code, this.sendResult(req, res)
        );
    }
    
    public generateCode(req: any, res: any): void {
        let siteId = req.params.site_id;

        this._sitesClient.generateCode(
            null, siteId, this.sendResult(req, res)
        );
    }

    public createSite(req: any, res: any): void {
        let data = req.body || {};
        let site: SiteV1;

        async.series([
            // Create a site
            (callback) => {
                this._sitesClient.createSite(
                    null, data, (err, data) => {
                        site = data;
                        callback(err);
                    }
                );
            },
            // Assign permissions to the owner
            (callback) => {
                if (this._rolesClient != null && req.user_id != null)
                    this._rolesClient.grantRoles(null, req.user_id, [ site.id + ':admin' ], callback);
                else callback();
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
                } else callback();
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(site);
        });
    }

    public updateSite(req: any, res: any): void {
        let siteId = req.params.site_id;
        let data = req.body || {};
        data.id = siteId;
        let site: SiteV1;

        async.series([
            // Update site
            (callback) => {
                this._sitesClient.updateSite(
                    null, data, (err, data) => {
                        site = data;
                        callback(err);
                    }
                );
            },
            // Update current user session
            (callback) => {
                if (req.user != null && req.session_id != null) {
                    let user = req.user;

                    user.sites = user.sites || [];
                    user.sites = _.filter(user.sites, s => s.id != site.id);
                    user.sites.push(site);

                    this._sessionsClient.updateSessionUser(null, req.session_id, user, callback);
                } else callback();
            }
        ], (err) => {
            if (err) this.sendError(req, res, err);
            else res.json(site);
        });
    }

    public deleteSite(req: any, res: any): void {
        let siteId = req.params.site_id;

        this._sitesClient.deleteSiteById(
            null, siteId, this.sendResult(req, res)
        );
    }

    public removeSite(req: any, res: any): void {
        let siteId = req.params.site_id;

        async.series([
            // Assign permissions to the owner
            (callback) => {
                if (this._rolesClient != null && req.user_id != null) {
                    this._rolesClient.revokeRoles(
                        null,
                        req.user_id,
                        [
                            siteId + ':admin',
                            siteId + ':manager',
                            siteId + ':user'
                        ],
                        callback
                    );
                } else callback();
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
                } else callback();
            }
        ], (err) => {
            this.sendEmptyResult(req, res)(err);
        });
    }
    
    public validateSiteCode(req: any, res: any): void {
        let code = req.param('code');

        this._sitesClient.getSiteByCode(
            null, code, (err, site) => {
                if (site) res.json(site.id);
                else res.json('');
            }
        );
    }
    
}