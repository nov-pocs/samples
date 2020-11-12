package clients1

import (
	"reflect"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	protos "github.com/nov-pocs/samples/service-beacons-go/protos"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cclients "github.com/pip-services3-go/pip-services3-grpc-go/clients"
)

type BeaconsGrpcClientV1 struct {
	*cclients.GrpcClient
	beaconV1DataPageType reflect.Type
	beaconV1Type         reflect.Type
	geoPointV1Type       reflect.Type
}

func NewBeaconsGrpcClientV1() *BeaconsGrpcClientV1 {
	c := &BeaconsGrpcClientV1{
		GrpcClient:           cclients.NewGrpcClient("beacons_v1.BeaconsV1"),
		beaconV1DataPageType: reflect.TypeOf(&data1.BeaconV1DataPage{}),
		beaconV1Type:         reflect.TypeOf(&data1.BeaconV1{}),
		geoPointV1Type:       reflect.TypeOf(&data1.GeoPointV1{}),
	}
	return c
}

func (c *BeaconsGrpcClientV1) GetBeacons(
	correlationId string, filter *cdata.FilterParams, paging *cdata.PagingParams) (*data1.BeaconV1DataPage, error) {

	req := &protos.BeaconV1PageRequest{
		CorrelationId: correlationId,
	}
	if filter != nil {
		req.Filter = filter.Value()
	}
	if paging != nil {
		req.Paging = &protos.PagingParams{
			Skip:  paging.GetSkip(0),
			Take:  (int32)(paging.GetTake(100)),
			Total: paging.Total,
		}
	}

	reply := new(protos.BeaconV1PageReply)
	time := c.Instrument(correlationId, "beacons.get_beacons")
	err := c.Call("get_beacons", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeaconPage(reply.Page)
	return result, err

}

func (c *BeaconsGrpcClientV1) GetBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {

	req := &protos.BeaconV1IdRequest{
		CorrelationId: correlationId,
		BeaconId:      beaconId,
	}

	reply := new(protos.BeaconV1ObjectReply)
	time := c.Instrument(correlationId, "beacons.get_beacon_by_id")
	err := c.Call("get_beacon_by_id", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeacon(reply.Beacon)
	return result, err

}

func (c *BeaconsGrpcClientV1) GetBeaconByUdi(
	correlationId string, udi string) (*data1.BeaconV1, error) {

	req := &protos.BeaconV1UdiRequest{
		CorrelationId: correlationId,
		BeaconUdi:     udi,
	}

	reply := new(protos.BeaconV1ObjectReply)
	time := c.Instrument(correlationId, "beacons.get_beacon_by_udi")
	err := c.Call("get_beacon_by_udi", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeacon(reply.Beacon)
	return result, err
}

func (c *BeaconsGrpcClientV1) CalculatePosition(
	correlationId string, siteId string, udis []string) (*data1.GeoPointV1, error) {

	req := &protos.BeaconV1PositionRequest{
		CorrelationId: correlationId,
		Udis:          udis,
		SiteId:        siteId,
	}

	reply := new(protos.BeaconV1PositionReply)
	time := c.Instrument(correlationId, "beacons.calculate_position")
	err := c.Call("calculate_position", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToPosition(reply.Point)
	return result, err
}

func (c *BeaconsGrpcClientV1) CreateBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {

	req := &protos.BeaconV1ObjectRequest{
		CorrelationId: correlationId,
		Beacon:        services1.FromBeacon(beacon),
	}

	reply := new(protos.BeaconV1ObjectReply)
	time := c.Instrument(correlationId, "beacons.create_beacon")
	err := c.Call("create_beacon", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeacon(reply.Beacon)
	return result, err
}

func (c *BeaconsGrpcClientV1) UpdateBeacon(
	correlationId string, beacon *data1.BeaconV1) (*data1.BeaconV1, error) {

	req := &protos.BeaconV1ObjectRequest{
		CorrelationId: correlationId,
		Beacon:        services1.FromBeacon(beacon),
	}

	reply := new(protos.BeaconV1ObjectReply)
	time := c.Instrument(correlationId, "beacons.update_beacon")
	err := c.Call("update_beacon", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeacon(reply.Beacon)
	return result, err
}

func (c *BeaconsGrpcClientV1) DeleteBeaconById(
	correlationId string, beaconId string) (*data1.BeaconV1, error) {

	req := &protos.BeaconV1IdRequest{
		CorrelationId: correlationId,
		BeaconId:      beaconId,
	}

	reply := new(protos.BeaconV1ObjectReply)
	time := c.Instrument(correlationId, "beacons.delete_beacon_by_id")
	err := c.Call("delete_beacon_by_id", correlationId, req, reply)
	time.EndTiming()

	if err != nil {
		return nil, err
	}

	err = services1.ToError(reply.Error)
	result := services1.ToBeacon(reply.Beacon)
	return result, err
}
