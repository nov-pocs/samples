"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let process = require('process');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const BeaconsJsonPostgresPersistence_1 = require("../../src/persistence/BeaconsJsonPostgresPersistence");
const BeaconsPersistenceFixture_1 = require("./BeaconsPersistenceFixture");
suite('BeaconsJsonPostgresPersistence', () => {
    let persistence;
    let fixture;
    let postgresUri = process.env['POSTGRES_SERVICE_URI'];
    let postgresHost = process.env['POSTGRES_SERVICE_HOST'] || 'localhost';
    let postgresPort = process.env['POSTGRES_SERVICE_PORT'] || 5432;
    let postgresDatabase = process.env['POSTGRES_SERVICE_DB'] || 'test';
    let postgresUser = process.env['POSTGRES_USER'] || 'postgres';
    let postgresPassword = process.env['POSTGRES_PASS'] || 'postgres';
    // Exit if postgres connection is not set
    if (postgresUri == '' && postgresHost == '')
        return;
    setup((done) => {
        persistence = new BeaconsJsonPostgresPersistence_1.BeaconsJsonPostgresPersistence();
        persistence.configure(pip_services3_commons_node_1.ConfigParams.fromTuples('connection.uri', postgresUri, 'connection.host', postgresHost, 'connection.port', postgresPort, 'connection.database', postgresDatabase, 'credential.username', postgresUser, 'credential.password', postgresPassword));
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
//# sourceMappingURL=BeaconsJsonProstgresPersistence.test.js.map