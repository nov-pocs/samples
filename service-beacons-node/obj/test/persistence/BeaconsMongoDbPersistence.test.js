"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let process = require('process');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const BeaconsMongoDbPersistence_1 = require("../../src/persistence/BeaconsMongoDbPersistence");
const BeaconsPersistenceFixture_1 = require("./BeaconsPersistenceFixture");
suite('BeaconsMongoDbPersistence', () => {
    let persistence;
    let fixture;
    let mongoUri = process.env['MONGO_SERVICE_URI'];
    let mongoHost = process.env['MONGO_SERVICE_HOST'] || 'localhost';
    let mongoPort = process.env['MONGO_SERVICE_PORT'] || 27017;
    let mongoDatabase = process.env['MONGO_SERVICE_DB'] || 'test';
    // Exit if mongo connection is not set
    if (mongoUri == '' && mongoHost == '')
        return;
    setup((done) => {
        persistence = new BeaconsMongoDbPersistence_1.BeaconsMongoDbPersistence();
        persistence.configure(pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', mongoUri, 'connection.host', mongoHost, 'connection.port', mongoPort, 'connection.database', mongoDatabase));
        fixture = new BeaconsPersistenceFixture_1.BeaconsPersistenceFixture(persistence);
        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
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
//# sourceMappingURL=BeaconsMongoDbPersistence.test.js.map