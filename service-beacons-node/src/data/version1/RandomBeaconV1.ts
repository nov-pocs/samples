import { IdGenerator } from 'pip-services3-commons-node'
import { RandomFloat } from 'pip-services3-commons-node'
import { RandomInteger } from 'pip-services3-commons-node'
import { RandomString } from 'pip-services3-commons-node'

import { BeaconTypeV1 } from './BeaconTypeV1';
import { BeaconV1 } from './BeaconV1'

export class RandomBeaconV1 {
    public static nextBeacon(siteCount: number = 100): BeaconV1 {
        return <BeaconV1> {
            id: IdGenerator.nextLong(),
            site_id: RandomBeaconV1.nextSiteId(siteCount),
            udi: IdGenerator.nextShort(),
            label: RandomString.nextString(10, 25),
            type: RandomBeaconV1.nextBeaconType(),
            radius: RandomFloat.nextFloat(3, 150),
            center: RandomBeaconV1.nextPosition()
        }
    }

    public static nextSiteId(siteCount: number = 100): string {
        return RandomInteger.nextInteger(1, siteCount).toString();
    }

    public static nextBeaconType(): string {
        let choice = RandomInteger.nextInteger(0, 3);
        switch (choice) {
            case 0:
                return BeaconTypeV1.iBeacon;
            case 1:
                return BeaconTypeV1.AltBeacon;
            case 2:
                return BeaconTypeV1.EddyStoneUdi;
            case 3:
                return BeaconTypeV1.Unknown;
            default:
                return BeaconTypeV1.Unknown;
        }
    }

    public static nextPosition(): any {
        return {
            type: "Point",
            coordinates: [
                [
                    RandomFloat.nextFloat(-180, 168), // Longitude
                    RandomFloat.nextFloat(-90, 90), // Latitude
                ]
            ]
        }
    }
}