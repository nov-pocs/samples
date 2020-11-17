import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { BeaconsMemoryPersistence } from '../../../src/persistence/BeaconsMemoryPersistence';
import { BeaconsController } from '../../../src/logic/BeaconsController';
import { BeaconsCommandableGrpcServiceV1 } from '../../../src/services/version1/BeaconsCommandableGrpcServiceV1';
import { BeaconsCommandableGrpcClientV1 } from '../../../src/clients/version1/BeaconsCommandableGrpcClientV1';
import { BeaconsClientV1Fixture } from './BeaconsClientV1Fixture';

suite('BeaconsCommandableGrpcClientV1', () => {
    let persistence: BeaconsMemoryPersistence;
    let controller: BeaconsController;
    let service: BeaconsCommandableGrpcServiceV1;
    let client: BeaconsCommandableGrpcClientV1;
    let fixture: BeaconsClientV1Fixture;

    setup((done) => {
        persistence = new BeaconsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new BeaconsController();
        controller.configure(new ConfigParams());

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );

        service = new BeaconsCommandableGrpcServiceV1();
        service.configure(httpConfig);

        client = new BeaconsCommandableGrpcClientV1();
        client.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('beacons', 'service', 'grpc', 'default', '1.0'), service,
            new Descriptor('beacons', 'client', 'grpc', 'default', '1.0'), client
        );
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);

        fixture = new BeaconsClientV1Fixture(client);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, (err) => {
                if (err) {
                    done(err);
                    return;
                }

                client.open(null, done);
            });
        });
    });

    teardown((done) => {
        client.close(null, (err) => {
            service.close(null, (err) => {
                persistence.close(null, done);
            });    
        });
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Calculate Position', (done) => {
        fixture.testCalculatePosition(done);
    });

});