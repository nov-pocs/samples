let process = require('process');

import { ConfigParams } from 'pip-services3-commons-node';

import { BeaconsPostgresPersistence } from '../../src/persistence/BeaconsPostgresPersistence';
import { BeaconsPersistenceFixture } from './BeaconsPersistenceFixture';

suite('BeaconsPostgresPersistence', () => {
    let persistence: BeaconsPostgresPersistence;
    let fixture: BeaconsPersistenceFixture;

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
        persistence = new BeaconsPostgresPersistence();
        persistence.configure(ConfigParams.fromTuples(
            'connection.uri', postgresUri,
            'connection.host', postgresHost,
            'connection.port', postgresPort,
            'connection.database', postgresDatabase,
            'credential.username', postgresUser,
            'credential.password', postgresPassword
        ));

        fixture = new BeaconsPersistenceFixture(persistence);

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