package data1

import (
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	rnd "github.com/pip-services3-go/pip-services3-commons-go/random"
)

var RandomBeaconV1 TRandomBeaconV1 = NewTRandomBeaconV1()

type TRandomBeaconV1 struct {
}

func NewTRandomBeaconV1() TRandomBeaconV1 {
	return TRandomBeaconV1{}
}

func (c *TRandomBeaconV1) NextBeacon(siteCount int) BeaconV1 {

	return BeaconV1{
		Id:     cdata.IdGenerator.NextLong(),
		SiteId: RandomBeaconV1.NextSiteId(siteCount),
		Udi:    cdata.IdGenerator.NextShort(),
		Label:  rnd.RandomString.NextString(10, 25),
		Type:   RandomBeaconV1.NextBeaconType(),
		Radius: rnd.RandomFloat.NextFloat(3, 150),
		Center: RandomBeaconV1.NextPosition(),
	}
}

func (c *TRandomBeaconV1) NextSiteId(siteCount int) string {
	return cconv.StringConverter.ToString(rnd.RandomInteger.NextInteger(1, siteCount))
}

func (c *TRandomBeaconV1) NextBeaconType() string {
	choice := rnd.RandomInteger.NextInteger(0, 3)
	switch choice {
	case 0:
		return IBeacon
	case 1:
		return AltBeacon
	case 2:
		return EddyStoneUdi
	case 3:
		return Unknown
	default:
		return Unknown
	}
}

func (c *TRandomBeaconV1) NextPosition() GeoPointV1 {
	return GeoPointV1{
		Type: "Point",
		Coordinates: [][]float32{
			{
				rnd.RandomFloat.NextFloat(-180, 168), // Longitude
				rnd.RandomFloat.NextFloat(-90, 90),   // Latitude
			},
		},
	}
}
