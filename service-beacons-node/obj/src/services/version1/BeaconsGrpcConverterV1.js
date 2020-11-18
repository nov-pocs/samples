"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const messages = require('../../../../src/protos/beacons_v1_pb');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const version1_1 = require("../../data/version1");
class BeaconsGrpcConverterV1 {
    static fromError(err) {
        if (err == null)
            return null;
        let description = pip_services3_commons_node_1.ErrorDescriptionFactory.create(err);
        let obj = new messages.ErrorDescription();
        obj.setType(description.type);
        obj.setCategory(description.category);
        obj.setCode(description.code);
        obj.setCorrelationId(description.correlation_id);
        obj.setStatus(description.status);
        obj.setMessage(description.message);
        obj.setCause(description.cause);
        obj.setStackTrace(description.stack_trace);
        BeaconsGrpcConverterV1.setMap(obj.getDetailsMap(), description.details);
        return obj;
    }
    static toError(obj) {
        if (obj == null || (obj.getCategory() == "" && obj.getMessage() == ""))
            return null;
        let description = {
            type: obj.getType(),
            category: obj.getCategory(),
            code: obj.getCode(),
            correlation_id: obj.getCorrelationId(),
            status: obj.getStatus(),
            message: obj.getMessage(),
            cause: obj.getCause(),
            stack_trace: obj.getStackTrace(),
            details: BeaconsGrpcConverterV1.getMap(obj.getDetailsMap())
        };
        return pip_services3_commons_node_2.ApplicationExceptionFactory.create(description);
    }
    static setMap(map, values) {
        if (values == null)
            return;
        if (_.isFunction(values.toObject))
            values = values.toObject();
        if (_.isArray(values)) {
            for (let entry of values) {
                if (_.isArray(entry))
                    map[entry[0]] = entry[1];
            }
        }
        else {
            if (_.isFunction(map.set)) {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map.set(propName, values[propName]);
                }
            }
            else {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map[propName] = values[propName];
                }
            }
        }
    }
    static getMap(map) {
        let values = {};
        BeaconsGrpcConverterV1.setMap(values, map);
        return values;
    }
    static fromBeacon(item) {
        if (item == null) {
            return null;
        }
        let beacon = new messages.BeaconV1();
        beacon.setId(item.id);
        beacon.setUdi(item.udi);
        beacon.setType(item.type);
        beacon.setSiteId(item.site_id);
        beacon.setRadius(item.radius);
        beacon.setLabel(item.label);
        beacon.setCenter(new messages.GeoPointV1());
        beacon.setCenter(BeaconsGrpcConverterV1.fromPosition(item.center));
        return beacon;
    }
    static toBeacon(item) {
        if (item == null) {
            return null;
        }
        let beacon = new version1_1.BeaconV1();
        beacon.id = item.getId();
        beacon.udi = item.getUdi();
        beacon.type = item.getType();
        beacon.site_id = item.getSiteId();
        beacon.radius = item.getRadius();
        beacon.label = item.getLabel();
        beacon.center = BeaconsGrpcConverterV1.toPosition(item.getCenter());
        return beacon;
    }
    static fromPosition(item) {
        if (item == null) {
            return null;
        }
        let point = new messages.GeoPointV1();
        point.setType(item.type || null);
        if (item.coordinates == null) {
            return point;
        }
        if (item.coordinates.length > 0 && !_.isArray(item.coordinates[0])) {
            let i = new messages.InternalArray();
            i.setInternalArrayList(item.coordinates);
            point.addCoordinates(i, 0);
            return point;
        }
        for (let index = 0; index < item.coordinates.length; index++) {
            let val = new messages.InternalArray();
            val.setInternalArrayList(item.coordinates[index]);
            point.addCoordinates(val, index);
        }
        return point;
    }
    static toPosition(item) {
        if (item == null) {
            return null;
        }
        let point = {
            type: '',
            coordinates: []
        };
        point.type = item.getType();
        let list = item.getCoordinatesList();
        if (list.length == 1) {
            point.coordinates = list[0].getInternalArrayList();
            return point;
        }
        for (let row of list) {
            point.coordinates.push(row.getInternalArrayList());
        }
        return point;
    }
    static fromBeaconsPage(page) {
        if (page == null)
            return null;
        let obj = new messages.BeaconV1Page();
        obj.setTotal(page.total);
        let data = _.map(page.data, BeaconsGrpcConverterV1.fromBeacon);
        obj.setDataList(data);
        return obj;
    }
    static toBeaconsPage(obj) {
        if (obj == null)
            return null;
        let data = _.map(obj.getDataList(), BeaconsGrpcConverterV1.toBeacon);
        let page = {
            total: obj.getTotal(),
            data: data
        };
        return page;
    }
    static fromPagingParams(paging) {
        if (paging == null)
            return null;
        let obj = new messages.PagingParams();
        obj.setSkip(paging.skip);
        obj.setTake(paging.take);
        obj.setTotal(paging.total);
        return obj;
    }
    static toPagingParams(obj) {
        if (obj == null)
            return null;
        let paging = new pip_services3_commons_node_1.PagingParams(obj.getSkip(), obj.getTake(), obj.getTotal());
        return paging;
    }
}
exports.BeaconsGrpcConverterV1 = BeaconsGrpcConverterV1;
//# sourceMappingURL=BeaconsGrpcConverterV1.js.map