const _ = require('lodash');
const async = require('async');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';

import { InvitationV1 } from '../../../src/clients/version1/InvitationV1';

import { TestUsers } from '../../fixtures/TestUsers';
import { TestReferences } from '../../fixtures/TestReferences';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { InvitationsOperationsV1 } from '../../../src/operations/version1/InvitationsOperationsV1';

let INVITATION1: InvitationV1 = {
    id: '1',
    action: 'activate',
    site_id: '1',
    role: 'manager',
    create_time: new Date(),
    creator_id: '1',
    invitee_email: 'test@somewhere.com'
};
let INVITATION2: InvitationV1 = {
    id: '2',
    action: 'activate',
    site_id: '1',
    create_time: new Date(),
    creator_id: '1',
    invitee_email: 'test2@somewhere.com'
};
let INVITATION3: InvitationV1 = {
    id: '3',
    action: 'notify',
    site_id: '1',
    create_time: new Date(),
    creator_id: '1',
    invitee_email: 'test2@somewhere.com'
};

suite('InvitationsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup((done) => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('iqs-services-facade', 'operations', 'invitations', 'default', '1.0'), new InvitationsOperationsV1())
        references.open(null, done);
    });

    teardown((done) => {
        references.close(null, done);
    });

    test('should resend invitations', (done) => {
        let invitation1: InvitationV1;

        async.series([
        // Send invitation
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + INVITATION1.site_id + '/invitations',
                    INVITATION1,
                    (err, req, res, invitation) => {
                        assert.isNull(err);

                        assert.isObject(invitation);
                        //assert.equal(invitation.creator_id, INVITATION1.creator_id);
                        assert.equal(invitation.site_id, INVITATION1.site_id);
                        assert.equal(invitation.invitee_email, INVITATION1.invitee_email);

                        invitation1 = invitation;

                        callback();
                    }
                );
            },
        // Send another invitation
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + invitation1.site_id + '/invitations/' + invitation1.id + '/resend', 
                    null,
                    (err, req, res, invitation) => {
                        assert.isNull(err);

                        // assert.isObject(invitation);
                        // assert.equal(invitation.id, invitation1.id);

                        callback();
                    }
                );
            }
        ], done);
    });


    test('should perform invitation operations', (done) => {
        let invitation1, invitation2: InvitationV1;

        async.series([
        // Send one invitation
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + INVITATION1.site_id + '/invitations',
                    INVITATION1,
                    (err, req, res, invitation) => {
                        assert.isNull(err);

                        assert.isObject(invitation);
                        //assert.equal(invitation.creator_id, INVITATION1.creator_id);
                        assert.equal(invitation.site_id, INVITATION1.site_id);
                        assert.equal(invitation.invitee_email, INVITATION1.invitee_email);

                        invitation1 = invitation;

                        callback();
                    }
                );
            },
        // Send another invitation
            (callback) => {
                rest.postAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + INVITATION2.site_id + '/invitations', 
                    INVITATION2,
                    (err, req, res, invitation) => {
                        assert.isNull(err);

                        assert.isObject(invitation);
                        //assert.equal(invitation.creator_id, INVITATION2.creator_id);
                        assert.equal(invitation.site_id, INVITATION2.site_id);
                        assert.equal(invitation.invitee_email, INVITATION2.invitee_email);

                        invitation2 = invitation;

                        callback();
                    }
                );
            },
        // Get all invitations
            (callback) => {
                rest.getAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + INVITATION1.site_id + '/invitations',
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        //!!assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Delete invitation
            (callback) => {
                rest.delAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + invitation1.site_id + '/invitations/' + invitation1.id,
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete invitation
            (callback) => {
                rest.getAsUser(
                    TestUsers.AdminUserSessionId,
                    '/api/v1/sites/' + invitation1.site_id + '/invitations/' + invitation1.id,
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('should notify invitations', (done) => {
        rest.postAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/sites/' + INVITATION1.site_id + '/invitations/notify',
            INVITATION3,
            (err, req, res) => {
                assert.isNull(err);

                done();
            }
        );
    });

});