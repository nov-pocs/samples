"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const BeaconTypeV1_1 = require("../../src/data/version1/BeaconTypeV1");
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
const BEACON3 = {
    id: '3',
    udi: '00003',
    type: BeaconTypeV1_1.BeaconTypeV1.AltBeacon,
    site_id: '2',
    label: 'TestBeacon3',
    center: { type: 'Point', coordinates: [10, 10] },
    radius: 50
};
class BeaconsPersistenceFixture {
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }
    testCreateBeacons(done) {
        async.series([
            // Create the first beacon
            (callback) => {
                this._persistence.create(null, BEACON1, (err, beacon) => {
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
                this._persistence.create(null, BEACON2, (err, beacon) => {
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
            // Create the third beacon
            (callback) => {
                this._persistence.create(null, BEACON3, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(BEACON3.udi, beacon.udi);
                    assert.equal(BEACON3.site_id, beacon.site_id);
                    assert.equal(BEACON3.type, beacon.type);
                    assert.equal(BEACON3.label, beacon.label);
                    assert.isNotNull(beacon.center);
                    callback();
                });
            }
        ], done);
    }
    testCrudOperations(done) {
        let beacon1;
        async.series([
            // Create items
            (callback) => {
                this.testCreateBeacons(callback);
            },
            // Get all beacons
            (callback) => {
                this._persistence.getPageByFilter(null, new pip_services3_commons_node_1.FilterParams(), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
                    assert.isNull(err);
                    assert.isObject(page);
                    assert.lengthOf(page.data, 3);
                    beacon1 = page.data[0];
                    callback();
                });
            },
            // Update the beacon
            (callback) => {
                beacon1.label = 'ABC';
                this._persistence.update(null, beacon1, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    assert.equal('ABC', beacon.label);
                    callback();
                });
            },
            // Get beacon by udi
            (callback) => {
                this._persistence.getOneByUdi(null, beacon1.udi, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Delete the beacon
            (callback) => {
                this._persistence.deleteById(null, beacon1.id, (err, beacon) => {
                    assert.isNull(err);
                    assert.isObject(beacon);
                    assert.equal(beacon1.id, beacon.id);
                    callback();
                });
            },
            // Try to get deleted beacon
            (callback) => {
                this._persistence.getOneById(null, beacon1.id, (err, beacon) => {
                    assert.isNull(err);
                    assert.isNull(beacon || null);
                    callback();
                });
            }
        ], done);
    }
    testGetWithFilters(done) {
        async.series([
            // Create items
            (callback) => {
                this.testCreateBeacons(callback);
            },
            // Filter by id
            (callback) => {
                this._persistence.getPageByFilter(null, pip_services3_commons_node_1.FilterParams.fromTuples('id', '1'), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
                    assert.isNull(err);
                    assert.lengthOf(page.data, 1);
                    callback();
                });
            },
            // Filter by udi
            (callback) => {
                this._persistence.getPageByFilter(null, pip_services3_commons_node_1.FilterParams.fromTuples('udi', '00002'), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
                    assert.isNull(err);
                    assert.lengthOf(page.data, 1);
                    callback();
                });
            },
            // Filter by udis
            (callback) => {
                this._persistence.getPageByFilter(null, pip_services3_commons_node_1.FilterParams.fromTuples('udis', '00001,00003'), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
                    assert.isNull(err);
                    assert.lengthOf(page.data, 2);
                    callback();
                });
            },
            // Filter by site_id
            (callback) => {
                this._persistence.getPageByFilter(null, pip_services3_commons_node_1.FilterParams.fromTuples('site_id', '1'), new pip_services3_commons_node_2.PagingParams(), (err, page) => {
                    assert.isNull(err);
                    assert.lengthOf(page.data, 2);
                    callback();
                });
            },
        ], done);
    }
}
exports.BeaconsPersistenceFixture = BeaconsPersistenceFixture;
//# sourceMappingURL=BeaconsPersistenceFixture.js.map