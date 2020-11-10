"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class BeaconV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('site_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('type', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('udi', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('label', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('center', null);
        this.withOptionalProperty('radius', pip_services3_commons_node_2.TypeCode.Float);
    }
}
exports.BeaconV1Schema = BeaconV1Schema;
//# sourceMappingURL=BeaconV1Schema.js.map