"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
let restify = require('restify');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const BeaconTypeV1_1 = require("../../../src/data/version1/BeaconTypeV1");
const BeaconsMemoryPersistence_1 = require("../../../src/persistence/BeaconsMemoryPersistence");
const BeaconsController_1 = require("../../../src/logic/BeaconsController");
const BeaconsHttpServiceV1_1 = require("../../../src/services/version1/BeaconsHttpServiceV1");
const BEACON1 = {
    id: '1',
    udi: '00001',
    type: BeaconTypeV1_1.BeaconTypeV1.AltBeacon,
    site_id: '1',
    label: 'TestBeacon1',
    center: { type: 'Point', coordinates: [0, 0] },
    radius: 50
};
const BEACON2 = {
    id: '2',
    udi: '00002',
    type: BeaconTypeV1_1.BeaconTypeV1.iBeacon,
    site_id: '1',
    label: 'TestBeacon2',
    center: { type: 'Point', coordinates: [2, 2] },
    radius: 70
};
suite('BeaconsHttpServiceV1', () => {
    let persistence;
    let controller;
    let service;
    let rest;
    setup((done) => {
        let url = "http://localhost:3000";
        rest = restify.createJsonClient({ url: url, version: '*' });
        persistence = new BeaconsMemoryPersistence_1.BeaconsMemoryPersistence();
        persistence.configure(new pip_services3_commons_node_1.ConfigParams());
        controller = new BeaconsController_1.BeaconsController();
        controller.configure(new pip_services3_commons_node_1.ConfigParams());
        service = new BeaconsHttpServiceV1_1.BeaconsHttpServiceV1();
        service.configure(pip_services3_commons_node_1.ConfigParams.fromTuples('connection.protocol', 'http', 'connection.port', 3000, 'connection.host', 'localhost'));
        let references = pip_services3_commons_node_3.References.fromTuples(new pip_services3_commons_node_2.Descriptor('beacons', 'persistence', 'memory', 'default', '1.0'), persistence, new pip_services3_commons_node_2.Descriptor('beacons', 'controller', 'default', 'default', '1.0'), controller, new pip_services3_commons_node_2.Descriptor('beacons', 'service', 'http', 'default', '1.0'), service);
        controller.setReferences(references);
        service.setReferences(references);
        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }
            service.open(null, done);
        });
    });
    teardown((done) => {
        service.close(null, (err) => {
            persistence.close(null, done);
        });
    });
    test('CRUD Operations', (done) => {
        let beacon1;
        async.series([
            // Create the first beacon
            (callback) => {
                rest.post('/v1/beacons/create_beacon', {
                    beacon: BEACON1
                }, (err, req, res, beacon) => {
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
                rest.post('/v1/beacons/create_beacon', {
                    beacon: BEACON2
                }, (err, req, res, beacon) => {
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
                rest.post('/v1/beacons/get_beacons', {
                    filter: new pip_services3_commons_node_4.FilterParams(),
                    paging: new pip_services3_commons_node_5.PagingParams()
                }, (err, req, res, page) => {
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
                rest.post('/v1/beacons/update_beacon', {
                    beacon: beacon1
                }, (err, req, res, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    assert.equal('ABC', beacon.label);
                    callback();
                });
            },
            // Get beacon by udi
            (callback) => {
                rest.post('/v1/beacons/get_beacon_by_udi', {
                    udi: beacon1.udi
                }, (err, req, res, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Calculate position for one beacon
            (callback) => {
                rest.post('/v1/beacons/calculate_position', {
                    site_id: '1',
                    udis: ['00001']
                }, (err, req, res, position) => {
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
                rest.post('/v1/beacons/delete_beacon_by_id', {
                    beacon_id: beacon1.id
                }, (err, req, res, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Try to get deleted beacon
            (callback) => {
                rest.post('/v1/beacons/get_beacon_by_id', {
                    beacon_id: beacon1.id
                }, (err, req, res, beacon) => {
                    assert.isNull(err);
                    //assert.isEmpty(beacon || null);
                    callback();
                });
            }
        ], done);
    });
});
//# sourceMappingURL=BeaconsHttpServiceV1.test.js.map