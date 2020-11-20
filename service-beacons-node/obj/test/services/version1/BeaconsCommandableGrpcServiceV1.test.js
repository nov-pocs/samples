"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let assert = require('chai').assert;
let grpc = require('grpc');
let protoLoader = require('@grpc/proto-loader');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_grpc_node_1 = require("pip-services3-grpc-node");
const src_1 = require("../../../src");
const logic_1 = require("../../../src/logic");
const persistence_1 = require("../../../src/persistence");
const BeaconsCommandableGrpcServiceV1_1 = require("../../../src/services/version1/BeaconsCommandableGrpcServiceV1");
var grpcConfig = pip_services3_commons_node_2.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3001);
const BEACON1 = {
    id: '1',
    udi: '00001',
    type: src_1.BeaconTypeV1.AltBeacon,
    site_id: '1',
    label: 'TestBeacon1',
    center: { type: 'Point', coordinates: [0, 0] },
    radius: 50
};
const BEACON2 = {
    id: '2',
    udi: '00002',
    type: src_1.BeaconTypeV1.iBeacon,
    site_id: '1',
    label: 'TestBeacon2',
    center: { type: 'Point', coordinates: [2, 2] },
    radius: 70
};
class TestGrpcClient extends pip_services3_grpc_node_1.CommandableGrpcClient {
    constructor() {
        super('beacons_v1');
    }
}
suite('BeaconsCommandableGrpcServiceV1', () => {
    let service;
    let client;
    suiteSetup((done) => {
        let controller = new logic_1.BeaconsController();
        let persistence = new persistence_1.BeaconsMemoryPersistence();
        service = new BeaconsCommandableGrpcServiceV1_1.BeaconsCommandableGrpcServiceV1();
        service.configure(grpcConfig);
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_1.Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services3_commons_node_1.Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller, new pip_services3_commons_node_1.Descriptor('beacons', 'service', 'grpc', 'default', '1.0'), service);
        controller.setReferences(references);
        service.setReferences(references);
        service.open(null, done);
    });
    suiteTeardown((done) => {
        service.close(null, done);
    });
    setup((done) => {
        client = new TestGrpcClient();
        client.configure(grpcConfig);
        client.open(null, done);
    });
    test('CRUD Operations', (done) => {
        let beacon1;
        async.series([
            // Create the first beacon
            (callback) => {
                client.callCommand("create_beacon", null, {
                    beacon: BEACON1
                }, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(BEACON1.udi, beacon.udi);
                    assert.equal(BEACON1.site_id, beacon.site_id);
                    assert.equal(BEACON1.type, beacon.type);
                    assert.equal(BEACON1.label, beacon.label);
                    assert.isNotNull(beacon.center);
                    callback();
                });
            },
            // Create the second beacon
            (callback) => {
                client.callCommand("create_beacon", null, {
                    beacon: BEACON2
                }, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(BEACON2.udi, beacon.udi);
                    assert.equal(BEACON2.site_id, beacon.site_id);
                    assert.equal(BEACON2.type, beacon.type);
                    assert.equal(BEACON2.label, beacon.label);
                    assert.isNotNull(beacon.center);
                    callback();
                });
            },
            // Get all beacons
            (callback) => {
                client.callCommand("get_beacons", null, {
                    filter: new pip_services3_commons_node_1.FilterParams(),
                    paging: new pip_services3_commons_node_1.PagingParams()
                }, (err, page) => {
                    assert.isNull(err);
                    assert.isObject(page);
                    assert.lengthOf(page.data, 2);
                    beacon1 = page.data[0];
                    callback();
                });
            },
            // Update the beacon
            (callback) => {
                beacon1.label = 'ABC';
                client.callCommand("update_beacon", null, {
                    beacon: beacon1
                }, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    assert.equal('ABC', beacon.label);
                    callback();
                });
            },
            // Get beacon by udi
            (callback) => {
                client.callCommand("get_beacon_by_udi", null, {
                    udi: beacon1.udi
                }, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Calculate position for one beacon
            (callback) => {
                client.callCommand("calculate_position", null, {
                    site_id: '1',
                    udis: ['00001']
                }, (err, position) => {
                    assert.isNull(err);
                    assert.isObject(position);
                    assert.equal('Point', position.type);
                    assert.lengthOf(position.coordinates, 2);
                    assert.equal(0, position.coordinates[0]);
                    assert.equal(0, position.coordinates[1]);
                    callback();
                });
            },
            // Delete the beacon
            (callback) => {
                client.callCommand("delete_beacon_by_id", null, {
                    beacon_id: beacon1.id
                }, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Try to get deleted beacon
            (callback) => {
                client.callCommand("get_beacon_by_id", null, {
                    beacon_id: beacon1.id
                }, (err, beacon) => {
                    assert.isNull(err);
                    //assert.isEmpty(beacon || null);
                    callback();
                });
            }
        ], done);
    });
});
//# sourceMappingURL=BeaconsCommandableGrpcServiceV1.test.js.map