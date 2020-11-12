package services1

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	crefer "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cvalid "github.com/pip-services3-go/pip-services3-commons-go/validate"
	cservices "github.com/pip-services3-go/pip-services3-rpc-go/services"
)

type BeaconsRestServiceV1 struct {
	*cservices.RestService
	controller logic.IBeaconsController
}

func NewBeaconsRestServiceV1() *BeaconsRestServiceV1 {
	c := &BeaconsRestServiceV1{}
	c.RestService = cservices.NewRestService()
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
	params := req.URL.Query()
	pagingParams := make(map[string]string, 0)

	pagingParams["skip"] = params.Get("skip")
	pagingParams["take"] = params.Get("take")
	pagingParams["total"] = params.Get("total")

	delete(params, "skip")
	delete(params, "take")
	delete(params, "total")

	result, err := c.controller.GetBeacons(
		params.Get("correlation_id"),
		cdata.NewFilterParamsFromValue(params),
		cdata.NewPagingParamsFromValue(pagingParams),
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconById(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.GetBeaconById(
		getParam(req, "correlation_id"),
		getParam(req, "beacon_id"))
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) createBeacon(res http.ResponseWriter, req *http.Request) {

	var beacon data1.BeaconV1
	err := decodeBody(req, &beacon)

	if err != nil {
		c.SendError(res, req, err)
	}

	result, err := c.controller.CreateBeacon(
		getParam(req, "correlation_id"),
		&beacon,
	)
	c.SendCreatedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) updateBeacon(res http.ResponseWriter, req *http.Request) {

	var beacon data1.BeaconV1
	err := decodeBody(req, &beacon)

	if err != nil {
		c.SendError(res, req, err)
	}

	result, err := c.controller.UpdateBeacon(
		getParam(req, "correlation_id"),
		&beacon,
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) deleteBeaconById(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.DeleteBeaconById(
		getParam(req, "correlation_id"),
		getParam(req, "beacon_id"),
	)
	c.SendDeletedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconByUdi(res http.ResponseWriter, req *http.Request) {
	result, err := c.controller.GetBeaconByUdi(
		getParam(req, "correlation_id"),
		getParam(req, "udi"))
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) calculatePosition(res http.ResponseWriter, req *http.Request) {

	bodyParams := make(map[string]interface{}, 0)
	err := decodeBody(req, &bodyParams)

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
		getParam(req, "correlation_id"),
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
		"get", "/beacon/{beacon_id}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("beacon_id", cconv.String).Schema,
		c.getBeaconById,
	)

	c.RegisterRoute(
		"get", "/beacon/udi/{udi}",
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
		"post", "/beacon",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("body", data1.NewBeaconV1Schema()).Schema,
		c.createBeacon,
	)

	c.RegisterRoute(
		"put", "/beacon",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("body", data1.NewBeaconV1Schema()).Schema,
		c.updateBeacon,
	)

	c.RegisterRoute(
		"delete", "/beacon/{beacon_id}",
		&cvalid.NewObjectSchema().
			WithRequiredProperty("beacon_id", cconv.String).Schema,
		c.deleteBeaconById,
	)
}

func getParam(req *http.Request, name string) string {
	param := req.URL.Query().Get(name)
	if param == "" {
		param = mux.Vars(req)[name]
	}
	return param
}

func decodeBody(req *http.Request, target interface{}) error {

	bytes, err := ioutil.ReadAll(req.Body)
	if err != nil {
		return err
	}
	defer req.Body.Close()
	err = json.Unmarshal(bytes, target)
	if err != nil {
		return err
	}
	return nil
}
