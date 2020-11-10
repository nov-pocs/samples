import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { BeaconsMemoryPersistence } from '../../../src/persistence/BeaconsMemoryPersistence';
import { BeaconsController } from '../../../src/logic/BeaconsController';
import { BeaconsDirectClientV1 } from '../../../src/clients/version1/BeaconsDirectClientV1';
import { BeaconsClientV1Fixture } from './BeaconsClientV1Fixture';

suite('BeaconsDirectClientV1', () => {
    let persistence: BeaconsMemoryPersistence;
    let controller: BeaconsController;
    let client: BeaconsDirectClientV1;
    let fixture: BeaconsClientV1Fixture;

    setup((done) => {
        persistence = new BeaconsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new BeaconsController();
        controller.configure(new ConfigParams());

        client = new BeaconsDirectClientV1();

        let references = References.fromTuples(
            new Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('beacons', 'client', 'direct', 'default', '1.0'), client
        );

        controller.setReferences(references);
        client.setReferences(references);

        fixture = new BeaconsClientV1Fixture(client);

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