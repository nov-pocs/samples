"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeaconsBenchmarkContext = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const BeaconsController_1 = require("../src/logic/BeaconsController");
const BeaconsServiceFactory_1 = require("../src/build/BeaconsServiceFactory");
class BeaconsBenchmarkContext {
    constructor(baseContext) {
        this._baseContext = baseContext;
    }
    open(callback) {
        let databaseType = this._baseContext.parameters['DatabaseType'].getAsString();
        let databaseUri = this._baseContext.parameters['DatabaseUri'].getAsString();
        let databaseHost = this._baseContext.parameters['DatabaseHost'].getAsString();
        let databasePort = this._baseContext.parameters['DatabasePort'].getAsInteger();
        let databaseName = this._baseContext.parameters['DatabaseName'].getAsString();
        let databaseUser = this._baseContext.parameters['DatabaseUser'].getAsString();
        let databasePassword = this._baseContext.parameters['DatabasePassword'].getAsString();
        let persistenceDescriptor = new pip_services3_commons_node_3.Descriptor("beacons", "persistence", databaseType, "*", "1.0");
        this.persistence = new BeaconsServiceFactory_1.BeaconsServiceFactory().create(persistenceDescriptor);
        this.persistence.configure(pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', databaseUri, 'connection.host', databaseHost, 'connection.port', databasePort, 'connection.database', databaseName, 'credential.username', databaseUser, 'credential.password', databasePassword));
        this.controller = new BeaconsController_1.BeaconsController();
        this.controller.configure(new pip_services3_commons_node_1.ConfigParams());
        let references = pip_services3_commons_node_2.References.fromTuples(new pip_services3_commons_node_3.Descriptor('beacons', 'persistence', databaseType, 'default', '1.0'), this.persistence, new pip_services3_commons_node_3.Descriptor('pip-services-positions', 'controller', 'default', 'default', '1.0'), this.controller);
        this.controller.setReferences(references);
        this.persistence.open(null, callback);
    }
    close(callback) {
        this.persistence.close(null, callback);
    }
}
exports.BeaconsBenchmarkContext = BeaconsBenchmarkContext;
//# sourceMappingURL=BeaconsBenchmarkContext.js.map