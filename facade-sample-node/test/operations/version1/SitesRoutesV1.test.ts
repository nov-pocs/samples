let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';

import { SiteV1 } from '../../../src/clients/version1/SiteV1';

import { TestUsers } from '../../fixtures/TestUsers';
import { TestReferences } from '../../fixtures/TestReferences';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { SitesOperationsV1 } from '../../../src/operations/version1/SitesOperationsV1';

let SITE1: SiteV1 = {
    id: '2',
    code: '111',
    name: 'Site #1',
    description: 'Test site #1',
    create_time: new Date(),
    creator_id: '123',
    active: true
};
let SITE2: SiteV1 = {
    id: '3',
    code: '222',
    name: 'Site #2',
    description: 'Test site #2',
    create_time: new Date(),
    creator_id: '123',
    active: true
};

suite('SitesOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('iqs-services-facade', 'operations', 'sites', 'default', '1.0'), new SitesOperationsV1())
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should perform site operations', (done) => {
        let site1, site2: SiteV1;

        async.series([
        // Create one site
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites',
                    SITE1,
                    (err, req, res, site) => {
                        assert.isNull(err);

                        assert.isObject(site);
                        assert.equal(site.name, SITE1.name);
                        assert.equal(site.description, SITE1.description);

                        site1 = site;

                        callback();
                    }
                );
            },
        // Create another site
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites', 
                    SITE2,
                    (err, req, res, site) => {
                        assert.isNull(err);

                        assert.isObject(site);
                        assert.equal(site.name, SITE2.name);
                        assert.equal(site.description, SITE2.description);

                        site2 = site;

                        callback();
                    }
                );
            },
        // Get all sites
            (callback) => {
                rest.getAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites',
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        // Account for 1 test site
                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                );
            },
        // Find site by code
            (callback) => {
                rest.get(
                    '/api/v1/sites/find_by_code?code=' + site1.code,
                    (err, req, res, site) => {
                        assert.isNull(err);

                        assert.isObject(site);
                        assert.equal(site.id, site1.id);

                        callback();
                    }
                );
            },
        // Validate site code
        (callback) => {
            rest.postAsUser(
                TestUsers.AdminUserSessionId,
                '/api/v1/sites/validate_code?code=' + site1.code,
                {},
                (err, req, res, result) => {
                    assert.isNull(err);

                    assert.equal(result, site1.id);

                    callback();
                }
            );
        },
    // Generate code
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + site1.id + '/generate_code',
                    {},
                    (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isNotNull(result);

                        callback();
                    }
                );
            },
        // Update the site
            (callback) => {
                site1.description = 'Updated Content 1';
                site1.center = { type: 'Point', coordinates: [32, -110] };
                site1.radius = 5;

                rest.putAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + site1.id,
                    site1,
                    (err, req, res, site) => {
                        assert.isNull(err);

                        assert.isObject(site);
                        assert.equal(site.description, 'Updated Content 1');
                        assert.equal(site.name, site1.name);
                        assert.isNotNull(site.boundaries);
                        assert.isNotNull(site.geometry);

                        site1 = site;

                        callback();
                    }
                );
            },
        // Delete site
            (callback) => {
                rest.delAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + site1.id,
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete site
            (callback) => {
                rest.getAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + site1.id,
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });

});