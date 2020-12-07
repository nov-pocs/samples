const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { UserRolesV1 } from './UserRolesV1';
import { IRolesClientV1 } from './IRolesClientV1';

export class RolesMemoryClientV1 implements IRolesClientV1 {
    private _roles: UserRolesV1[] = [];

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i2]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let id = filter.getAsNullableString('id');
        let ids = filter.getAsObject('ids');
        let exceptIds = filter.getAsObject('except_ids');
        let roles = filter.getAsObject('roles');
        let exceptRoles = filter.getAsObject('except_roles');
        
        // Process ids filter
        if (_.isString(ids))
            ids = ids.split(',');
        if (!_.isArray(ids))
            ids = null;

        // Process except ids filter
        if (_.isString(exceptIds))
            exceptIds = exceptIds.split(',');
        if (!_.isArray(exceptIds))
            exceptIds = null;

        // Process roles filter
        if (_.isString(roles))
            roles = roles.split(',');
        if (!_.isArray(roles))
            roles = null;

        // Process except roles filter
        if (_.isString(exceptRoles))
            exceptRoles = exceptRoles.split(',');
        if (!_.isArray(exceptRoles))
            exceptRoles = null;
        
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (ids && _.indexOf(ids, item.id) < 0)
                return false;
            if (exceptIds && _.indexOf(exceptIds, item.id) >= 0)
                return false;
            if (roles && !this.contains(roles, item.roles))
                return false;
            if (exceptRoles && this.contains(exceptRoles, item.roles))
                return false;
            return true; 
        };
    }

    public getRolesByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<UserRolesV1>) => void): void {
        let roles = _.filter(this._roles, this.composeFilter(filter));
        callback(null, new DataPage<UserRolesV1>(roles, roles.length));
    }

    public getRolesById(correlationId: string, userId: string,
        callback: (err: any, roles: string[]) => void) {
        let roles = _.find(this._roles, (d) => d.id == userId);
        callback(null, roles);
    }

    public setRoles(correlationId: string, userId: string, roles: string[],
        callback?: (err: any, roles: string[]) => void) {

        let userRoles: UserRolesV1 = _.find(this._roles, (d) => d.id == userId);
        if (userRoles) {
            userRoles.roles = roles;
            userRoles.update_time = new Date();
        } else {
            userRoles = new UserRolesV1(userId, roles);
            this._roles.push(userRoles);
        }

        if (callback) callback(null, roles || []);
    }

    public grantRoles(correlationId: string, userId: string, roles: string[],
        callback?: (err: any, roles: string[]) => void) {
        // If there are no roles then skip processing
        if (roles.length == 0) {
            if (callback) callback(null, null);
            return;
        }

        this.getRolesById(
            correlationId, 
            userId,
            (err, existingRoles) => {
                if (err) {
                    callback(err, null);
                    return;
                }

                let newRoles = _.union(roles, existingRoles);

                this.setRoles(
                    correlationId, 
                    userId,
                    newRoles,
                    callback
                )
            }
        );
    }

    public revokeRoles(correlationId: string, userId: string, roles: string[],
        callback?: (err: any, roles: string[]) => void) {
        // If there are no roles then skip processing
        if (roles.length == 0) {
            if (callback) callback(null, null);
            return;
        }

        this.getRolesById(
            correlationId, 
            userId,
            (err, existingRoles) => {
                if (err) {
                    callback(err, null);
                    return;
                }

                let newRoles = _.difference(existingRoles, roles);

                this.setRoles(
                    correlationId, 
                    userId,
                    newRoles,
                    callback
                )
            }
        );
    }
    
    public authorize(correlationId: string, userId: string, roles: string[],
        callback: (err: any, authorized: boolean) => void) {
        // If there are no roles then skip processing
        if (roles.length == 0) {
            if (callback) callback(null, true);
            return;
        }

        this.getRolesById(
            correlationId, 
            userId,
            (err, existingRoles) => {
                if (err) {
                    callback(err, false);
                    return;
                }
                
                let authorized = _.difference(roles, existingRoles).length == 0;
                                
                callback(null, authorized);
            }
        );
    }
}
