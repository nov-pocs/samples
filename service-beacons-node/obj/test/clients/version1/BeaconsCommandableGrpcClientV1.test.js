"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const BeaconsMemoryPersistence_1 = require("../../../src/persistence/BeaconsMemoryPersistence");
const BeaconsController_1 = require("../../../src/logic/BeaconsController");
const BeaconsCommandableGrpcServiceV1_1 = require("../../../src/services/version1/BeaconsCommandableGrpcServiceV1");
const BeaconsCommandableGrpcClientV1_1 = require("../../../src/clients/version1/BeaconsCommandableGrpcClientV1");
const BeaconsClientV1Fixture_1 = require("./BeaconsClientV1Fixture");
suite('BeaconsCommandableGrpcClientV1', () => {
    let persistence;
    let controller;
    let service;
    let client;
    let fixture;
    setup((done) => {
        persistence = new BeaconsMemoryPersistence_1.BeaconsMemoryPersistence();
        persistence.configure(new pip_services3_commons_node_1.ConfigParams());
        controller = new BeaconsController_1.BeaconsController();
        controller.configure(new pip_services3_commons_node_1.ConfigParams());
        let httpConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.port', 3000, 'connection.host', 'localhost');
        service = new BeaconsCommandableGrpcServiceV1_1.BeaconsCommandableGrpcServiceV1();
        service.configure(httpConfig);
        client = new BeaconsCommandableGrpcClientV1_1.BeaconsCommandableGrpcClientV1();
        client.configure(httpConfig);
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_2.Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services3_commons_node_2.Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller, new pip_services3_commons_node_2.Descriptor('beacons', 'service', 'grpc', 'default', '1.0'), service, new pip_services3_commons_node_2.Descriptor('beacons', 'client', 'grpc', 'default', '1.0'), client);
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);
        fixture = new BeaconsClientV1Fixture_1.BeaconsClientV1Fixture(client);
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
//# sourceMappingURL=BeaconsCommandableGrpcClientV1.test.js.map