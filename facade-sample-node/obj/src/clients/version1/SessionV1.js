"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class SessionV1 {
    constructor(id, user_id, user_name, address, client) {
        this.id = id || pip_services3_commons_node_1.IdGenerator.nextLong();
        this.user_id = user_id;
        this.user_name = user_name;
        this.active = true;
        this.open_time = new Date();
        this.request_time = new Date();
        this.address = address;
        this.client = client;
    }
}
exports.SessionV1 = SessionV1;
//# sourceMappingURL=SessionV1.js.map