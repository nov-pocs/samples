package services1

import (
	"context"
	"encoding/json"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	protos "github.com/nov-pocs/samples/service-beacons-go/protos"
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cvalid "github.com/pip-services3-go/pip-services3-commons-go/validate"
	grpcservices "github.com/pip-services3-go/pip-services3-grpc-go/services"
)

type BeaconsGrpcServiceV1 struct {
	*grpcservices.GrpcService
	controller    logic.IBeaconsController
	numberOfCalls int64
}

func NewBeaconsGrpcServiceV1() *BeaconsGrpcServiceV1 {
	c := BeaconsGrpcServiceV1{}
	c.GrpcService = grpcservices.NewGrpcService("beacons_v1.BeaconsV1")
	c.GrpcService.IRegisterable = &c
	c.numberOfCalls = 0
	c.DependencyResolver.Put("controller", cref.NewDescriptor("beacons", "controller", "default", "*", "*"))
	return &c
}

func (c *BeaconsGrpcServiceV1) SetReferences(references cref.IReferences) {
	c.GrpcService.SetReferences(references)
	resolv, err := c.DependencyResolver.GetOneRequired("controller")
	if err == nil && resolv != nil {
		c.controller = resolv.(logic.IBeaconsController)
		return
	}
	panic("Can't resolve 'controller' reference")
}

func (c *BeaconsGrpcServiceV1) Open(correlationId string) error {
	// Add interceptors here

	return c.GrpcService.Open(correlationId)
}

func (c *BeaconsGrpcServiceV1) GetBeacons(ctx context.Context, req *protos.BeaconV1PageRequest) (*protos.BeaconV1PageReply, error) {

	filter := cdata.NewFilterParamsFromValue(req.GetFilter())
	paging := cdata.NewEmptyPagingParams()
	if req.Paging != nil {
		paging = cdata.NewPagingParams(req.Paging.GetSkip(), req.Paging.GetTake(), req.Paging.GetTotal())
	}
	data, err := c.controller.GetBeacons(
		req.CorrelationId,
		filter,
		paging,
	)
	if err != nil || data == nil {
		return nil, err
	}

	result := protos.BeaconV1PageReply{}
	result.Page.Total = *data.Total
	for _, v := range data.Data {
		buf := protos.BeaconV1{}
		bytes, _ := json.Marshal(v)
		json.Unmarshal(bytes, &buf)
		result.Page.Data = append(result.Page.Data, &buf)
	}
	return &result, err
}

func (c *BeaconsGrpcServiceV1) GetBeaconById(ctx context.Context, req *protos.BeaconV1IdRequest) (*protos.BeaconV1ObjectReply, error) {

	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("BeaconId", cconv.String)

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	data, err := c.controller.GetBeaconById(
		req.CorrelationId,
		req.BeaconId,
	)
	if err != nil {
		return nil, err
	}
	result := protos.BeaconV1ObjectReply{}
	bytes, _ := json.Marshal(data)
	json.Unmarshal(bytes, &result)
	return &result, nil
}

func (c *BeaconsGrpcServiceV1) CreateBeacon(ctx context.Context, req *protos.BeaconV1ObjectRequest) (*protos.BeaconV1ObjectReply, error) {

	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("Beacon", data1.NewBeaconV1Schema())

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	beacon := ToBeacon(req.Beacon)

	data, err := c.controller.CreateBeacon(
		req.CorrelationId,
		beacon,
	)

	result := protos.BeaconV1ObjectReply{}
	result.Error = FromError(err)
	result.Beacon = FromBeacon(data)

	return &result, err
}

func (c *BeaconsGrpcServiceV1) UpdateBeacon(ctx context.Context, req *protos.BeaconV1ObjectRequest) (*protos.BeaconV1ObjectReply, error) {

	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("Beacon", data1.NewBeaconV1Schema())

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	beacon := ToBeacon(req.Beacon)
	data, err := c.controller.UpdateBeacon(
		req.CorrelationId,
		beacon,
	)

	result := protos.BeaconV1ObjectReply{}
	result.Error = FromError(err)
	result.Beacon = FromBeacon(data)

	return &result, err
}

func (c *BeaconsGrpcServiceV1) DeleteBeaconById(ctx context.Context, req *protos.BeaconV1IdRequest) (*protos.BeaconV1ObjectReply, error) {

	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("BeaconId", cconv.String)

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	beacon, err := c.controller.DeleteBeaconById(
		req.CorrelationId,
		req.BeaconId,
	)
	result := protos.BeaconV1ObjectReply{}
	result.Error = FromError(err)
	result.Beacon = FromBeacon(beacon)
	return &result, err
}

func (c *BeaconsGrpcServiceV1) GetBeaconByUdi(ctx context.Context, req *protos.BeaconV1UdiRequest) (*protos.BeaconV1ObjectReply, error) {

	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("BeaconId", cconv.String)

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	beacon, err := c.controller.GetBeaconByUdi(
		req.CorrelationId,
		req.BeaconUdi,
	)
	result := protos.BeaconV1ObjectReply{}
	result.Error = FromError(err)
	result.Beacon = FromBeacon(beacon)
	return &result, err
}

func (c *BeaconsGrpcServiceV1) CalculatePosition(ctx context.Context, req *protos.BeaconV1PositionRequest) (*protos.BeaconV1PositionReply, error) {
	Schema := cvalid.NewObjectSchema().
		WithRequiredProperty("SiteId", cconv.String).
		WithRequiredProperty("Udis", cvalid.NewArraySchema(cconv.String))

	validateErr := Schema.ValidateAndReturnError("", *req, false)

	if validateErr != nil {
		return nil, validateErr
	}

	position, err := c.controller.CalculatePosition(
		req.CorrelationId,
		req.SiteId,
		req.Udis,
	)
	result := protos.BeaconV1PositionReply{}
	result.Error = FromError(err)
	result.Coordinates = FromPosition(position)
	return &result, err
}

func (c *BeaconsGrpcServiceV1) Register() {
	protos.RegisterBeaconsV1Server(c.Endpoint.GetServer(), c)
}
