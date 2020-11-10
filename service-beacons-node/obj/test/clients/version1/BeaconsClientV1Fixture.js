"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const BeaconTypeV1_1 = require("../../../src/data/version1/BeaconTypeV1");
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
class BeaconsClientV1Fixture {
    constructor(client) {
        assert.isNotNull(client);
        this._client = client;
    }
    testCrudOperations(done) {
        let beacon1;
        async.series([
            // Create the first beacon
            (callback) => {
                this._client.createBeacon(null, BEACON1, (err, beacon) => {
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
                this._client.createBeacon(null, BEACON2, (err, beacon) => {
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
                this._client.getBeacons(null, new pip_services3_commons_node_1.FilterParams(), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
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
                this._client.updateBeacon(null, beacon1, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    assert.equal('ABC', beacon.label);
                    callback();
                });
            },
            // Get beacon by udi
            (callback) => {
                this._client.getBeaconByUdi(null, beacon1.udi, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Delete the beacon
            (callback) => {
                this._client.deleteBeaconById(null, beacon1.id, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Try to get deleted beacon
            (callback) => {
                this._client.getBeaconById(null, beacon1.id, (err, beacon) => {
                    assert.isNull(err);
                    assert.isNull(beacon || null);
                    callback();
                });
            }
        ], done);
    }
    testCalculatePosition(done) {
        async.series([
            // Create the first beacon
            (callback) => {
                this._client.createBeacon(null, BEACON1, (err, beacon) => {
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
                this._client.createBeacon(null, BEACON2, (err, beacon) => {
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
            // Calculate position for one beacon
            (callback) => {
                this._client.calculatePosition(null, '1', ['00001'], (err, position) => {
                    assert.isNull(err);
                    assert.isObject(position);
                    assert.equal('Point', position.type);
                    assert.lengthOf(position.coordinates, 2);
                    assert.equal(0, position.coordinates[0]);
                    assert.equal(0, position.coordinates[1]);
                    callback();
                });
            }
        ], done);
    }
}
exports.BeaconsClientV1Fixture = BeaconsClientV1Fixture;
//# sourceMappingURL=BeaconsClientV1Fixture.js.map