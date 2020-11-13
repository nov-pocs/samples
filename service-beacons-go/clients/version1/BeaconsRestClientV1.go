package clients1

import (
	"reflect"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cclients "github.com/pip-services3-go/pip-services3-rpc-go/clients"
)

type BeaconsRestClientV1 struct {
	*cclients.RestClient
	beaconV1DataPageType reflect.Type
	beaconV1Type         reflect.Type
	geoPointV1Type       reflect.Type
}

func NewBeaconsRestClientV1() *BeaconsRestClientV1 {
	c := &BeaconsRestClientV1{
		RestClient:           cclients.NewRestClient(),
		beaconV1DataPageType: reflect.TypeOf(&data1.BeaconV1DataPage{}),
		beaconV1Type:         reflect.TypeOf(&data1.BeaconV1{}),
		geoPointV1Type:       reflect.TypeOf(&data1.GeoPointV1{}),
	}
	c.BaseRoute = "v1/beacons"
	return c
}

func (c *BeaconsRestClientV1) GetBeacons(
	correlationId string, filter *cdata.FilterParams, paging *cdata.PagingParams) (*data1.BeaconV1DataPage, error) {
	params := cdata.NewEmptyStringValueMap()
	c.AddFilterParams(params, filter)
	c.AddPagingParams(params, paging)

	res, err := c.Call(c.beaconV1DataPageType, "get", "/beacons", correlationId, params, nil)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1DataPage)
	return result, nil
}

func (c *BeaconsRestClientV1) GetBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {

	res, err := c.Call(c.beaconV1Type, "get", "/beacon/"+beaconId, correlationId, nil, nil)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1)
	return result, nil
}

func (c *BeaconsRestClientV1) GetBeaconByUdi(
	correlationId string, udi string) (*data1.BeaconV1, error) {

	res, err := c.Call(c.beaconV1Type, "get", "/beacon/udi/"+udi, correlationId, nil, nil)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1)
	return result, nil
}

func (c *BeaconsRestClientV1) CalculatePosition(
	correlationId string, siteId string, udis []string) (*data1.GeoPointV1, error) {
	params := cdata.NewAnyValueMapFromTuples(
		"site_id", siteId,
		"udis", udis,
	)

	res, err := c.Call(c.geoPointV1Type, "post", "/calculate_position", correlationId, nil, params.Value())
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.GeoPointV1)
	return result, nil
}

func (c *BeaconsRestClientV1) CreateBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {

	res, err := c.Call(c.beaconV1Type, "post", "/beacon", correlationId, nil, beacon)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1)
	return result, nil
}

func (c *BeaconsRestClientV1) UpdateBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {

	res, err := c.Call(c.beaconV1Type, "put", "/beacon/"+beacon.Id, correlationId, nil, beacon)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1)
	return result, nil
}

func (c *BeaconsRestClientV1) DeleteBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {

	res, err := c.Call(c.beaconV1Type, "delete", "/beacon/"+beaconId, correlationId, nil, nil)
	if err != nil {
		return nil, err
	}

	result, _ := res.(*data1.BeaconV1)
	return result, nil
}
