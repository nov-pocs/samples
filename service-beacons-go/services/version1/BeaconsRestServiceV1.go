package services1

import (
	"net/http"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	crefer "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cvalid "github.com/pip-services3-go/pip-services3-commons-go/validate"
	cservices "github.com/pip-services3-go/pip-services3-rpc-go/services"
)

type BeaconsRestServiceV1 struct {
	*cservices.RestService
	controller logic.IBeaconsController
}

func NewBeaconsRestServiceV1() *BeaconsRestServiceV1 {
	c := &BeaconsRestServiceV1{
		RestService: cservices.NewRestService(),
	}
	c.RestService.IRegisterable = c
	c.BaseRoute = "v1/beacons"
	c.DependencyResolver.Put("controller", crefer.NewDescriptor("beacons", "controller", "default", "*", "*"))
	return c
}

func (c *BeaconsRestServiceV1) SetReferences(references crefer.IReferences) {
	c.RestService.SetReferences(references)
	ctrl, err := c.DependencyResolver.GetOneRequired("controller")
	if err == nil && ctrl != nil {
		c.controller = ctrl.(logic.IBeaconsController)
	}
}

func (c *BeaconsRestServiceV1) getBeacons(res http.ResponseWriter, req *http.Request) {

	result, err := c.controller.GetBeacons(
		c.GetParam(req, "correlation_id"),
		c.GetFilterParams(req),
		c.GetPagingParams(req),
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconById(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.GetBeaconById(
		c.GetParam(req, "correlation_id"),
		c.GetParam(req, "beacon_id"))
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) createBeacon(res http.ResponseWriter, req *http.Request) {

	var beacon data1.BeaconV1
	err := c.DecodeBody(req, &beacon)

	if err != nil {
		c.SendError(res, req, err)
	}

	result, err := c.controller.CreateBeacon(
		c.GetParam(req, "correlation_id"),
		&beacon,
	)
	c.SendCreatedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) updateBeacon(res http.ResponseWriter, req *http.Request) {

	var beacon data1.BeaconV1
	err := c.DecodeBody(req, &beacon)

	if err != nil {
		c.SendError(res, req, err)
	}

	result, err := c.controller.UpdateBeacon(
		c.GetParam(req, "correlation_id"),
		&beacon,
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) deleteBeaconById(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.DeleteBeaconById(
		c.GetParam(req, "correlation_id"),
		c.GetParam(req, "beacon_id"),
	)
	c.SendDeletedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconByUdi(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.GetBeaconByUdi(
		c.GetParam(req, "correlation_id"),
		c.GetParam(req, "udi"))
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) calculatePosition(res http.ResponseWriter, req *http.Request) {

	bodyParams := make(map[string]interface{}, 0)
	err := c.DecodeBody(req, &bodyParams)

	if err != nil {
		c.SendError(res, req, err)
	}

	udiValues, _ := bodyParams["udis"].([]interface{})
	udis := make([]string, 0, 0)
	for _, udi := range udiValues {
		v, _ := udi.(string)
		udis = append(udis, v)
	}
	siteId, _ := bodyParams["site_id"].(string)

	result, err := c.controller.CalculatePosition(
		c.GetParam(req, "correlation_id"),
		siteId,
		udis)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) Register() {

	c.RegisterRoute(
		"get", "/beacons",
		&cvalid.NewObjectSchema().WithOptionalProperty("skip", cconv.String).
			WithOptionalProperty("take", cconv.String).
			WithOptionalProperty("total", cconv.String).
			WithOptionalProperty("body", cvalid.NewFilterParamsSchema()).Schema,
		c.getBeacons,
	)

	c.RegisterRoute(
		"get", "/beacons/{beacon_id}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("beacon_id", cconv.String).Schema,
		c.getBeaconById,
	)

	c.RegisterRoute(
		"get", "/beacons/udi/{udi}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("udi", cconv.String).Schema,
		c.getBeaconByUdi,
	)

	// Todo: this method shall receive many UDIs! Pass siteid and udi them as query parameters
	c.RegisterRoute(
		"post", "/calculate_position",
		&cvalid.NewObjectSchema().WithRequiredProperty("body",
			cvalid.NewObjectSchema().
				WithRequiredProperty("site_id", cconv.String).
				WithRequiredProperty("udis", cvalid.NewArraySchema(cconv.String))).Schema,
		c.calculatePosition,
	)

	c.RegisterRoute(
		"post", "/beacons",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("body", data1.NewBeaconV1Schema()).Schema,
		c.createBeacon,
	)

	c.RegisterRoute(
		"put", "/beacons/{beacon_id}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("body", data1.NewBeaconV1Schema()).Schema,
		c.updateBeacon,
	)

	c.RegisterRoute(
		"delete", "/beacons/{beacon_id}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("beacon_id", cconv.String).Schema,
		c.deleteBeaconById,
	)
}
