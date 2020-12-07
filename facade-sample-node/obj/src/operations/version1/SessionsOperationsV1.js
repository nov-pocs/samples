"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_services3_rpc_node_2 = require("pip-services3-rpc-node");
class SessionsOperationsV1 extends pip_services3_rpc_node_2.RestOperations {
    constructor() {
        super();
        this._cookie = 'x-session-id';
        this._cookieEnabled = true;
        this._maxCookieAge = 365 * 24 * 60 * 60 * 1000;
        this._dependencyResolver.put('settings', new pip_services3_commons_node_3.Descriptor('pip-services-settings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('accounts', new pip_services3_commons_node_3.Descriptor('pip-services-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_node_3.Descriptor('pip-services-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('roles', new pip_services3_commons_node_3.Descriptor('pip-services-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services3_commons_node_3.Descriptor('pip-services-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services3_commons_node_3.Descriptor('pip-services-sessions', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sites', new pip_services3_commons_node_3.Descriptor('nov-services-sites', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('invitations', new pip_services3_commons_node_3.Descriptor('nov-services-invitations', 'client', '*', '*', '1.0'));
    }
    configure(config) {
        config = config.setDefaults(SessionsOperationsV1._defaultConfig1);
        this._dependencyResolver.configure(config);
        this._cookieEnabled = config.getAsBooleanWithDefault('options.cookie_enabled', this._cookieEnabled);
        this._cookie = config.getAsStringWithDefault('options.cookie', this._cookie);
        this._maxCookieAge = config.getAsLongWithDefault('options.max_cookie_age', this._maxCookieAge);
    }
    setReferences(references) {
        super.setReferences(references);
        this._settingsClient = this._dependencyResolver.getOneRequired('settings');
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._rolesClient = this._dependencyResolver.getOneRequired('roles');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._sitesClient = this._dependencyResolver.getOneRequired('sites');
        this._invitationsClient = this._dependencyResolver.getOneRequired('invitations');
    }
    loadSession(req, res, next) {
        // Is user really cached? If yes, then we shall reinvalidate cache when connections are changed
        // if (req.user) {
        //     callback(null, req.user);
        //     return;
        // }
        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id']; // || req.cookies[this._cookie];
        if (sessionId) {
            this._sessionsClient.getSessionById('facade', sessionId, (err, session) => {
                if (session == null && err == null) {
                    err = new pip_services3_commons_node_5.UnauthorizedException('facade', 'SESSION_NOT_FOUND', 'Session invalid or already expired.').withDetails('session_id', sessionId).withStatus(440);
                }
                if (err == null) {
                    // Associate session user with the request
                    req.user_id = session.user_id;
                    req.user_name = session.user_name;
                    req.user = session.user;
                    req.session_id = session.id;
                    next();
                }
                else {
                    this.sendError(req, res, err);
                }
            });
        }
        else {
            next();
        }
    }
    openSession(req, res, account, roles) {
        let session;
        let sites;
        let passwordInfo;
        let settings;
        async.series([
            // Retrieve sites for user
            (callback) => {
                let siteRoles = _.filter(roles, r => r.indexOf(':') > 0);
                let siteIds = _.map(siteRoles, (r) => {
                    let pos = r.indexOf(':');
                    return pos >= 0 ? r.substring(0, pos) : r;
                });
                if (siteIds.length > 0) {
                    let filter = pip_services3_commons_node_2.FilterParams.fromTuples('ids', siteIds);
                    this._sitesClient.getSites(null, filter, null, (err, page) => {
                        sites = page != null ? page.data : [];
                        callback(err);
                    });
                }
                else {
                    sites = [];
                    callback();
                }
            },
            (callback) => {
                this._passwordsClient.getPasswordInfo(null, account.id, (err, data) => {
                    passwordInfo = data;
                    callback(err);
                });
            },
            (callback) => {
                this._settingsClient.getSectionById(null, account.id, (err, data) => {
                    settings = data;
                    callback(err);
                });
            },
            // Open a new user session
            (callback) => {
                let user = {
                    id: account.id,
                    name: account.name,
                    login: account.login,
                    create_time: account.create_time,
                    time_zone: account.time_zone,
                    language: account.language,
                    theme: account.theme,
                    roles: roles,
                    sites: _.map(sites, s => { return { id: s.id, name: s.name }; }),
                    settings: settings,
                    change_pwd_time: passwordInfo != null ? passwordInfo.change_time : null,
                    custom_hdr: account.custom_hdr,
                    custom_dat: account.custom_dat
                };
                let address = pip_services3_rpc_node_1.HttpRequestDetector.detectAddress(req);
                let client = pip_services3_rpc_node_1.HttpRequestDetector.detectBrowser(req);
                let platform = pip_services3_rpc_node_1.HttpRequestDetector.detectPlatform(req);
                this._sessionsClient.openSession(null, account.id, account.name, address, client, user, null, (err, data) => {
                    session = data;
                    callback(err);
                });
            },
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else {
                // Set cookie with session id
                //if (session && this._cookieEnabled)
                ////res.cookie(this._cookie, session.id, { maxAge: this._maxCookieAge });
                //res.headers['Set-Cookie'] = this._cookie + '=' + session.id; // Todo: add max age
                res.json(session);
            }
        });
    }
    signup(req, res) {
        let signupData = req.body;
        let account = null;
        let invited = false;
        let roles = [];
        async.series([
            // Validate password first
            (callback) => {
                // Todo: complete implementation after validate password is added
                callback();
            },
            // Create account
            (callback) => {
                let newAccount = {
                    name: signupData.name,
                    login: signupData.login || signupData.email,
                    language: signupData.language,
                    theme: signupData.theme,
                    time_zone: signupData.time_zone
                };
                this._accountsClient.createAccount(null, newAccount, (err, data) => {
                    account = data;
                    callback(err);
                });
            },
            // Create password for the account
            (callback) => {
                let password = signupData.password;
                this._passwordsClient.setPassword(null, account.id, password, callback);
            },
            // Activate all pending invitations
            (callback) => {
                let email = signupData.email;
                this._invitationsClient.activateInvitations(null, email, account.id, (err, invitations) => {
                    if (invitations) {
                        // Calculate user roles from activated invitations
                        for (let invitation of invitations) {
                            // Was user invited with the same email?
                            invited = invited || email == invitation.invitee_email;
                            if (invitation.site_id) {
                                invitation.role = invitation.role || 'user';
                                let role = invitation.site_id + ':' + invitation.role;
                                roles.push(role);
                            }
                        }
                    }
                    callback(err);
                });
            },
            // Create email settings for the account
            (callback) => {
                let email = signupData.email;
                let newEmailSettings = {
                    id: account.id,
                    name: account.name,
                    email: email,
                    language: account.language
                };
                if (this._emailSettingsClient != null) {
                    if (invited) {
                        this._emailSettingsClient.setVerifiedSettings(null, newEmailSettings, callback);
                    }
                    else {
                        this._emailSettingsClient.setSettings(null, newEmailSettings, callback);
                    }
                }
                else
                    callback();
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                this.openSession(req, res, account, roles);
        });
    }
    signupValidate(req, res) {
        let login = req.param('login');
        if (login) {
            this._accountsClient.getAccountByIdOrLogin(null, login, (err, account) => {
                if (err == null && account != null) {
                    err = new pip_services3_commons_node_4.BadRequestException(null, 'LOGIN_ALREADY_USED', 'Login ' + login + ' already being used').withDetails('login', login);
                }
                if (err)
                    this.sendError(req, res, err);
                else
                    res.json(204);
            });
        }
        else {
            res.json(204);
        }
    }
    signin(req, res) {
        let login = req.param('login');
        let password = req.param('password');
        let account;
        let roles = [];
        async.series([
            // Find user account
            (callback) => {
                this._accountsClient.getAccountByIdOrLogin(null, login, (err, data) => {
                    if (err == null && data == null) {
                        err = new pip_services3_commons_node_4.BadRequestException(null, 'WRONG_LOGIN', 'Account ' + login + ' was not found').withDetails('login', login);
                    }
                    account = data;
                    callback(err);
                });
            },
            // Authenticate user
            (callback) => {
                this._passwordsClient.authenticate(null, account.id, password, (err, result) => {
                    // wrong password error is UNKNOWN when use http client
                    if ((err == null && result == false) || (err && err.cause == 'Invalid password')) {
                        err = new pip_services3_commons_node_4.BadRequestException(null, 'WRONG_PASSWORD', 'Wrong password for account ' + login).withDetails('login', login);
                    }
                    callback(err);
                });
            },
            // Retrieve user roles
            (callback) => {
                if (this._rolesClient) {
                    this._rolesClient.getRolesById(null, account.id, (err, data) => {
                        roles = data;
                        callback(err);
                    });
                }
                else {
                    roles = [];
                    callback();
                }
            }
        ], (err) => {
            if (err)
                this.sendError(req, res, err);
            else
                this.openSession(req, res, account, roles);
        });
    }
    signout(req, res) {
        // Cleanup cookie with session id
        // if (this._cookieEnabled)
        //     res.clearCookie(this._cookie);
        if (req.session_id) {
            this._sessionsClient.closeSession(null, req.session_id, (err, session) => {
                if (err)
                    this.sendError(req, res, err);
                else
                    res.json(204);
            });
        }
        else {
            res.json(204);
        }
    }
    getSessions(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        this._sessionsClient.getSessions(null, filter, paging, this.sendResult(req, res));
    }
    restoreSession(req, res) {
        let sessionId = req.param('session_id');
        this._sessionsClient.getSessionById(null, sessionId, (err, session) => {
            // If session closed then return null
            if (session && !session.active)
                session = null;
            if (err)
                this.sendError(req, res, err);
            else if (session)
                res.json(session);
            else
                res.json(204);
        });
    }
    getUserSessions(req, res) {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let userId = req.params.user_id || req.params.account_id;
        filter.setAsObject('user_id', userId);
        this._sessionsClient.getSessions(null, filter, paging, this.sendResult(req, res));
    }
    getCurrentSession(req, res) {
        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id']; // || req.cookies[this._cookie];
        this._sessionsClient.getSessionById(null, sessionId, this.sendResult(req, res));
    }
    closeSession(req, res) {
        let sessionId = req.params.session_id || req.param('session_id');
        this._sessionsClient.closeSession(null, sessionId, this.sendResult(req, res));
    }
}
exports.SessionsOperationsV1 = SessionsOperationsV1;
SessionsOperationsV1._defaultConfig1 = pip_services3_commons_node_1.ConfigParams.fromTuples('options.cookie_enabled', true, 'options.cookie', 'x-session-id', 'options.max_cookie_age', 365 * 24 * 60 * 60 * 1000);
//# sourceMappingURL=SessionsOperationsV1.js.map