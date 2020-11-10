"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const BeaconsMemoryPersistence_1 = require("../../src/persistence/BeaconsMemoryPersistence");
const BeaconsPersistenceFixture_1 = require("./BeaconsPersistenceFixture");
suite('BeaconsMemoryPersistence', () => {
    let persistence;
    let fixture;
    setup((done) => {
        persistence = new BeaconsMemoryPersistence_1.BeaconsMemoryPersistence();
        persistence.configure(new pip_services3_commons_node_1.ConfigParams());
        fixture = new BeaconsPersistenceFixture_1.BeaconsPersistenceFixture(persistence);
        persistence.open(null, done);
    });
    teardown((done) => {
        persistence.close(null, done);
    });
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
    test('Get with Filters', (done) => {
        fixture.testGetWithFilters(done);
    });
});
//# sourceMappingURL=BeaconsMemoryPersistence.test.js.map