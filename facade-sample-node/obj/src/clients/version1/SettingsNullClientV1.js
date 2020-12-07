"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class SettingsNullClientV1 {
    constructor(config) { }
    getSectionIds(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_2.DataPage());
    }
    getSections(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_2.DataPage());
    }
    getSectionById(correlationId, id, callback) {
        callback(null, new pip_services3_commons_node_1.ConfigParams());
    }
    setSection(correlationId, id, parameters, callback) {
        callback(null, parameters);
    }
    modifySection(correlationId, id, updateParams, incrementParams, callback) {
        updateParams = updateParams || new pip_services3_commons_node_1.ConfigParams();
        incrementParams = incrementParams || new pip_services3_commons_node_1.ConfigParams();
        updateParams = updateParams.override(incrementParams);
        callback(null, updateParams);
    }
}
exports.SettingsNullClientV1 = SettingsNullClientV1;
//# sourceMappingURL=SettingsNullClientV1.js.map