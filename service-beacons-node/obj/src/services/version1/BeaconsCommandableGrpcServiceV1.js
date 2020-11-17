"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsCommandableGrpcServiceV1 = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_grpc_node_1 = require("pip-services3-grpc-node");
class BeaconsCommandableGrpcServiceV1 extends pip_services3_grpc_node_1.CommandableGrpcService {
    constructor() {
        super('beacons_v1');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('beacons', 'controller', 'default', '*', '*'));
    }
}
exports.BeaconsCommandableGrpcServiceV1 = BeaconsCommandableGrpcServiceV1;
//# sourceMappingURL=BeaconsCommandableGrpcServiceV1.js.map