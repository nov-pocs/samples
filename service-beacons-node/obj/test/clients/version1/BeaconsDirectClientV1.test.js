"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const BeaconsMemoryPersistence_1 = require("../../../src/persistence/BeaconsMemoryPersistence");
const BeaconsController_1 = require("../../../src/logic/BeaconsController");
const BeaconsDirectClientV1_1 = require("../../../src/clients/version1/BeaconsDirectClientV1");
const BeaconsClientV1Fixture_1 = require("./BeaconsClientV1Fixture");
suite('BeaconsDirectClientV1', () => {
    let persistence;
    let controller;
    let client;
    let fixture;
    setup((done) => {
        persistence = new BeaconsMemoryPersistence_1.BeaconsMemoryPersistence();
        persistence.configure(new pip_services3_commons_node_1.ConfigParams());
        controller = new BeaconsController_1.BeaconsController();
        controller.configure(new pip_services3_commons_node_1.ConfigParams());
        client = new BeaconsDirectClientV1_1.BeaconsDirectClientV1();
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_2.Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services3_commons_node_2.Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller, new pip_services3_commons_node_2.Descriptor('beacons', 'client', 'direct', 'default', '1.0'), client);
        controller.setReferences(references);
        client.setReferences(references);
        fixture = new BeaconsClientV1Fixture_1.BeaconsClientV1Fixture(client);
        persistence.open(null, done);
    });
    teardown((done) => {
        persistence.close(null, done);
    });
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
    test('Calculate Positions', (done) => {
        fixture.testCalculatePosition(done);
    });
});
//# sourceMappingURL=BeaconsDirectClientV1.test.js.map