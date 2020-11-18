const _ = require('lodash');
const messages = require('../../../../src/protos/beacons_v1_pb');

import { DataPage, ErrorDescriptionFactory, PagingParams } from 'pip-services3-commons-node';
import { ErrorDescription } from 'pip-services3-commons-node';
import { ApplicationExceptionFactory } from 'pip-services3-commons-node';
import { BeaconV1 } from '../../data/version1';

export class BeaconsGrpcConverterV1 {

    public static fromError(err: any): any {
        if (err == null) return null;

        let description = ErrorDescriptionFactory.create(err);
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

    public static toError(obj: any): any {
        if (obj == null || (obj.getCategory() == "" && obj.getMessage() == ""))
            return null;

        let description: ErrorDescription = {
            type: obj.getType(),
            category: obj.getCategory(),
            code: obj.getCode(),
            correlation_id: obj.getCorrelationId(),
            status: obj.getStatus(),
            message: obj.getMessage(),
            cause: obj.getCause(),
            stack_trace: obj.getStackTrace(),
            details: BeaconsGrpcConverterV1.getMap(obj.getDetailsMap())
        }

        return ApplicationExceptionFactory.create(description);
    }

    public static setMap(map: any, values: any): void {
        if (values == null) return;

        if (_.isFunction(values.toObject))
            values = values.toObject();

        if (_.isArray(values)) {
            for (let entry of values) {
                if (_.isArray(entry))
                    map[entry[0]] = entry[1];
            }
        } else {
            if (_.isFunction(map.set)) {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map.set(propName, values[propName]);
                }
            } else {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map[propName] = values[propName];
                }
            }
        }
    }

    public static getMap(map: any): any {
        let values = {};
        BeaconsGrpcConverterV1.setMap(values, map);
        return values;
    }

    public static fromBeacon(item: BeaconV1): any {

        if (item == null) {
            return null;
        }

        let beacon = new messages.BeaconV1()
        beacon.setId(item.id);
        beacon.setUdi(item.udi);
        beacon.setType(item.type);
        beacon.setSiteId(item.site_id);
        beacon.setRadius(item.radius);
        beacon.setLabel(item.label);
        beacon.setCenter(new messages.GeoPointV1());
        beacon.setCenter(BeaconsGrpcConverterV1.fromPosition(item.center))

        return beacon;
    }

    public static toBeacon(item: any): BeaconV1 {

        if (item == null) {
            return null;
        }

        let beacon = new BeaconV1();
        beacon.id = item.getId();
        beacon.udi = item.getUdi();
        beacon.type = item.getType();
        beacon.site_id = item.getSiteId();
        beacon.radius = item.getRadius();
        beacon.label = item.getLabel();
        beacon.center = BeaconsGrpcConverterV1.toPosition(item.getCenter())

        return beacon
    }

    public static fromPosition(item: any): any {

        if (item == null) {
            return null;
        }

        let point = new messages.GeoPointV1()
        point.setType(item.type || null)

        if (item.coordinates == null) {
            return point
        }

        if (item.coordinates.length > 0 && !_.isArray(item.coordinates[0])) {
            let i = new messages.InternalArray()
            i.setInternalArrayList(item.coordinates);
            point.addCoordinates(i, 0);
            return point
        }

        for (let index = 0; index < item.coordinates.length; index++) {

            let val = new messages.InternalArray()
            val.setInternalArrayList(item.coordinates[index]);
            point.addCoordinates(val, index);
        }
        return point

    }

    public static toPosition(item: any): any {

        if (item == null) {
            return null;
        }

        let point = {
            type: '',
            coordinates: []
        }
        point.type = item.getType()
        let list = item.getCoordinatesList();

        if (list.length == 1) {
            point.coordinates = list[0].getInternalArrayList();
            return point
        }
        
        for (let row of list) {
            point.coordinates.push(row.getInternalArrayList())
        }
        return point
    }

    public static fromBeaconsPage(page: DataPage<BeaconV1>): any {
        if (page == null) return null;

        let obj = new messages.BeaconV1Page();

        obj.setTotal(page.total);
        let data = _.map(page.data, BeaconsGrpcConverterV1.fromBeacon);
        obj.setDataList(data);

        return obj;
    }

    public static toBeaconsPage(obj: any): DataPage<BeaconV1> {
        if (obj == null) return null;

        let data = _.map(obj.getDataList(), BeaconsGrpcConverterV1.toBeacon);
        let page: DataPage<BeaconV1> = {
            total: obj.getTotal(),
            data: data
        };

        return page;
    }


    public static fromPagingParams(paging: PagingParams): any {
        if (paging == null) return null;

        let obj = new messages.PagingParams();

        obj.setSkip(paging.skip);
        obj.setTake(paging.take);
        obj.setTotal(paging.total);

        return obj;
    }

    public static toPagingParams(obj: any): PagingParams {
        if (obj == null)
            return null;

        let paging: PagingParams = new PagingParams(
            obj.getSkip(),
            obj.getTake(),
            obj.getTotal()
        );

        return paging;
    }

}