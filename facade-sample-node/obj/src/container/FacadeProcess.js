"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const ClientFacadeFactory_1 = require("../build/ClientFacadeFactory");
const FacadeFactory_1 = require("../build/FacadeFactory");
class FacadeProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("nov-facades-application", "Sample facade for NOV");
        this._factories.add(new ClientFacadeFactory_1.ClientFacadeFactory);
        this._factories.add(new FacadeFactory_1.FacadeFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.FacadeProcess = FacadeProcess;
//# sourceMappingURL=FacadeProcess.js.map