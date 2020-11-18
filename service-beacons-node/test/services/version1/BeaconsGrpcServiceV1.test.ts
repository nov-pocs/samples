let assert = require('chai').assert;
let grpc = require('grpc');
let async = require('async');

let services = require('../../../../src/protos/beacons_v1_grpc_pb');
let messages = require('../../../../src/protos/beacons_v1_pb');

import { Descriptor, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { BeaconTypeV1, BeaconV1 } from '../../../src';
import { BeaconsController } from '../../../src/logic/BeaconsController';
import { BeaconsMemoryPersistence } from '../../../src/persistence/BeaconsMemoryPersistence';
import { BeaconsGrpcConverterV1 } from '../../../src/services/version1/BeaconsGrpcConverterV1';
import { BeaconsGrpcServiceV1 } from '../../../src/services/version1/BeaconsGrpcServiceV1';

var grpcConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

const BEACON1: BeaconV1 = {
    id: '1',
    udi: '00001',
    type: BeaconTypeV1.AltBeacon,
    site_id: '1',
    label: 'TestBeacon1',
    center: { type: 'Point', coordinates: [0, 0] },
    radius: 50
};

const BEACON2: BeaconV1 = {
    id: '2',
    udi: '00002',
    type: BeaconTypeV1.iBeacon,
    site_id: '1',
    label: 'TestBeacon2',
    center: { type: 'Point', coordinates: [2, 2] },
    radius: 70
};

suite('BeaconsV1GrpcServiceV1', () => {

    let service: BeaconsGrpcServiceV1;

    let client: any;

    suiteSetup((done) => {
        let persistence = new BeaconsMemoryPersistence();
        let controller = new BeaconsController();

        service = new BeaconsGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('beacons', 'service', 'grpc', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        client = new services.BeaconsV1Client('localhost:3000', grpc.credentials.createInsecure());
    });

    test('CRUD Operations', (done) => {
        let beacon1: BeaconV1;

        async.series([
            
            // Create the first beacon
            (callback) => {
                let request = new messages.BeaconV1ObjectRequest()
                request.setBeacon(BeaconsGrpcConverterV1.fromBeacon(BEACON1))

                client.create_beacon(
                    request,
                    (err, response) => {
                        assert.isNull(err);
                        
                        let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());

                        assert.isObject(beacon);
                        assert.equal(BEACON1.udi, beacon.udi);
                        assert.equal(BEACON1.site_id, beacon.site_id);
                        assert.equal(BEACON1.type, beacon.type);
                        assert.equal(BEACON1.label, beacon.label);
                        assert.isNotNull(beacon.center);

                        callback();
                    }
                );
            },
            // Create the second beacon
            (callback) => {
                let request = new messages.BeaconV1ObjectRequest()
                request.setBeacon(BeaconsGrpcConverterV1.fromBeacon(BEACON2))
                client.create_beacon(
                    request,
                    (err, response) => {
                        assert.isNull(err);
                        let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());

                        assert.isObject(beacon);
                        assert.equal(BEACON2.udi, beacon.udi);
                        assert.equal(BEACON2.site_id, beacon.site_id);
                        assert.equal(BEACON2.type, beacon.type);
                        assert.equal(BEACON2.label, beacon.label);
                        assert.isNotNull(beacon.center);

                        callback();
                    }
                );
            },
            // Get all beacons
            (callback) => {
                let request = new messages.BeaconV1PageRequest();
                
                client.get_beacons(
                    request,
                    (err, response) => {
                        assert.isNull(err);
                        let page = BeaconsGrpcConverterV1.toBeaconsPage(response.getPage());

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        beacon1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the beacon
            (callback) => {
                beacon1.label = 'ABC';
                let request = new messages.BeaconV1ObjectRequest()
                request.setBeacon(BeaconsGrpcConverterV1.fromBeacon(beacon1))

                client.update_beacon(
                   request,
                    (err, response) => {
                        assert.isNull(err);
                        let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);
                        assert.equal('ABC', beacon.label);

                        callback();
                    }
                )
            },
            // Get beacon by udi
            (callback) => {
                let request = new messages.BeaconV1UdiRequest()
                request.setBeaconUdi( beacon1.udi)

                client.get_beacon_by_udi(
                    request,
                    (err, response) => {
                        assert.isNull(err);
                        let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);

                        callback();
                    }
                )
            },

            // Calculate position for one beacon
            (callback) => {
                let request = new messages.BeaconV1PositionRequest()
                request.setSiteId('1')
                request.setUdisList(['00001'])

                client.calculate_position(
                    request,
                    (err, response) => {
                        assert.isNull(err);

                        let position = BeaconsGrpcConverterV1.toPosition(response.getPoint());

                        assert.isObject(position);
                        assert.equal('Point', position.type);
                        assert.lengthOf(position.coordinates, 2);
                        assert.equal(0, position.coordinates[0]);
                        assert.equal(0, position.coordinates[1]);

                        callback();
                    }
                )
            },

            // Delete the beacon
            (callback) => {
                let request = new messages.BeaconV1IdRequest()
                request.setBeaconId( beacon1.id)
                client.delete_beacon_by_id(
                   request,
                    (err, response) => {
                        assert.isNull(err);
                        let beacon = BeaconsGrpcConverterV1.toBeacon(response.getBeacon());

                        assert.isObject(beacon);
                        assert.equal(beacon1.id, beacon.id);

                        callback();
                    }
                )
            },
            // Try to get deleted beacon
            (callback) => {
                let request = new messages.BeaconV1IdRequest()
                request.setBeaconId( beacon1.id)
                client.get_beacon_by_id(
                    request,
                    (err, response) => {
                        assert.isNull(err);

                        //assert.isEmpty(beacon || null);

                        callback();
                    }
                )
            }

        ], done);
    });
});
