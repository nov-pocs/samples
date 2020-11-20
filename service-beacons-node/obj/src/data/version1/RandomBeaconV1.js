"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomBeaconV1 = void 0;
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const BeaconTypeV1_1 = require("./BeaconTypeV1");
class RandomBeaconV1 {
    static nextBeacon(siteCount = 100) {
        return {
            id: pip_services3_commons_node_1.IdGenerator.nextLong(),
            site_id: RandomBeaconV1.nextSiteId(siteCount),
            udi: pip_services3_commons_node_1.IdGenerator.nextShort(),
            label: pip_services3_commons_node_4.RandomString.nextString(10, 25),
            type: RandomBeaconV1.nextBeaconType(),
            radius: pip_services3_commons_node_2.RandomFloat.nextFloat(3, 150),
            center: RandomBeaconV1.nextPosition()
        };
    }
    static nextSiteId(siteCount = 100) {
        return pip_services3_commons_node_3.RandomInteger.nextInteger(1, siteCount).toString();
    }
    static nextBeaconType() {
        let choice = pip_services3_commons_node_3.RandomInteger.nextInteger(0, 3);
        switch (choice) {
            case 0:
                return BeaconTypeV1_1.BeaconTypeV1.iBeacon;
            case 1:
                return BeaconTypeV1_1.BeaconTypeV1.AltBeacon;
            case 2:
                return BeaconTypeV1_1.BeaconTypeV1.EddyStoneUdi;
            case 3:
                return BeaconTypeV1_1.BeaconTypeV1.Unknown;
            default:
                return BeaconTypeV1_1.BeaconTypeV1.Unknown;
        }
    }
    static nextPosition() {
        return {
            type: "Point",
            coordinates: [
                [
                    pip_services3_commons_node_2.RandomFloat.nextFloat(-180, 168),
                    pip_services3_commons_node_2.RandomFloat.nextFloat(-90, 90),
                ]
            ]
        };
    }
}
exports.RandomBeaconV1 = RandomBeaconV1;
//# sourceMappingURL=RandomBeaconV1.js.map