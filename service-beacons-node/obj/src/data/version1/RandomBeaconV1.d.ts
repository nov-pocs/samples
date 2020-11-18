import { BeaconV1 } from './BeaconV1';
export declare class RandomBeaconV1 {
    static nextBeacon(siteCount?: number): BeaconV1;
    static nextSiteId(siteCount?: number): string;
    static nextBeaconType(): string;
    static nextPosition(): any;
}
