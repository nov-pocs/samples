package clients1

import (
	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
)

type BeaconsNullClientV1 struct {
}

func NewBeaconsNullClientV1() *BeaconsNullClientV1 {
	return &BeaconsNullClientV1{}
}

func (c *BeaconsNullClientV1) getBeacons(
	correlationId string, filter *cdata.FilterParams,
	paging *cdata.PagingParams) (*data1.BeaconV1DataPage, error) {
	return data1.NewEmptyBeaconV1DataPage(), nil
}

func (c *BeaconsNullClientV1) getBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {
	return nil, nil
}

func (c *BeaconsNullClientV1) getBeaconByUdi(
	correlationId string, udi string) (*data1.BeaconV1, error) {
	return nil, nil
}

func (c *BeaconsNullClientV1) calculatePosition(
	correlationId string, siteId string, udis []string) (*data1.GeoPointV1, error) {
	return nil, nil
}

func (c *BeaconsNullClientV1) createBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {
	return nil, nil
}

func (c *BeaconsNullClientV1) updateBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {
	return nil, nil
}

func (c *BeaconsNullClientV1) deleteBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {
	return nil, nil
}
