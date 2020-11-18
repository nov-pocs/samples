import { DataPage, PagingParams } from 'pip-services3-commons-node';
import { BeaconV1 } from '../../data/version1';
export declare class BeaconsGrpcConverterV1 {
    static fromError(err: any): any;
    static toError(obj: any): any;
    static setMap(map: any, values: any): void;
    static getMap(map: any): any;
    static fromBeacon(item: BeaconV1): any;
    static toBeacon(item: any): BeaconV1;
    static fromPosition(item: any): any;
    static toPosition(item: any): any;
    static fromBeaconsPage(page: DataPage<BeaconV1>): any;
    static toBeaconsPage(obj: any): DataPage<BeaconV1>;
    static fromPagingParams(paging: PagingParams): any;
    static toPagingParams(obj: any): PagingParams;
}
