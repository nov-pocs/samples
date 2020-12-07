"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const SettingsNullClientV1_1 = require("../clients/version1/SettingsNullClientV1");
const AccountsMemoryClientV1_1 = require("../clients/version1/AccountsMemoryClientV1");
const PasswordsNullClientV1_1 = require("../clients/version1/PasswordsNullClientV1");
const RolesMemoryClientV1_1 = require("../clients/version1/RolesMemoryClientV1");
const SessionsMemoryClientV1_1 = require("../clients/version1/SessionsMemoryClientV1");
const EmailSettingsMemoryClientV1_1 = require("../clients/version1/EmailSettingsMemoryClientV1");
const SitesMemoryClientV1_1 = require("../clients/version1/SitesMemoryClientV1");
const InvitationsNullClientV1_1 = require("../clients/version1/InvitationsNullClientV1");
const BeaconsMemoryClientV1_1 = require("../clients/version1/BeaconsMemoryClientV1");
class ClientFacadeFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ClientFacadeFactory.SettingsNullClientV1Descriptor, SettingsNullClientV1_1.SettingsNullClientV1);
        this.registerAsType(ClientFacadeFactory.AccountsMemoryClientV1Descriptor, AccountsMemoryClientV1_1.AccountsMemoryClientV1);
        this.registerAsType(ClientFacadeFactory.PasswordNullClientV1Descriptor, PasswordsNullClientV1_1.PasswordsNullClientV1);
        this.registerAsType(ClientFacadeFactory.RolesMemoryClientV1Descriptor, RolesMemoryClientV1_1.RolesMemoryClientV1);
        this.registerAsType(ClientFacadeFactory.SessionsMemoryClientV1Descriptor, SessionsMemoryClientV1_1.SessionsMemoryClientV1);
        this.registerAsType(ClientFacadeFactory.EmailSettingsMemoryClientV1Descriptor, EmailSettingsMemoryClientV1_1.EmailSettingsMemoryClientV1);
        this.registerAsType(ClientFacadeFactory.SitesMemoryClientV1Descriptor, SitesMemoryClientV1_1.SitesMemoryClientV1);
        this.registerAsType(ClientFacadeFactory.InvitationsNullClientV1Descriptor, InvitationsNullClientV1_1.InvitationsNullClientV1);
        this.registerAsType(ClientFacadeFactory.BeaconsMemoryClientV1Descriptor, BeaconsMemoryClientV1_1.BeaconsMemoryClientV1);
    }
}
exports.ClientFacadeFactory = ClientFacadeFactory;
ClientFacadeFactory.SettingsNullClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-settings", "client", "null", "*", "1.0");
ClientFacadeFactory.AccountsMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-accounts", "client", "memory", "*", "1.0");
ClientFacadeFactory.PasswordNullClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-passwords", "client", "null", "*", "1.0");
ClientFacadeFactory.RolesMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-roles", "client", "memory", "*", "1.0");
ClientFacadeFactory.SessionsMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-sessions", "client", "memory", "*", "1.0");
ClientFacadeFactory.EmailSettingsMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-emailsettings", "client", "memory", "*", "1.0");
ClientFacadeFactory.SitesMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("nov-services-sites", "client", "memory", "*", "1.0");
ClientFacadeFactory.InvitationsNullClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("nov-services-invitations", "client", "null", "*", "1.0");
ClientFacadeFactory.BeaconsMemoryClientV1Descriptor = new pip_services3_commons_node_1.Descriptor("nov-services-beacons", "client", "memory", "*", "1.0");
//# sourceMappingURL=ClientFacadeFactory.js.map