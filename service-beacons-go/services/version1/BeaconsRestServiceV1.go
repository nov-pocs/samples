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
	cerr "github.com/pip-services3-go/pip-services3-commons-go/errors"
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
		cdata.NewFilterParamsFromValue(params), // W! need test
		cdata.NewPagingParamsFromValue(pagingParams),
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconById(res http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	vars := mux.Vars(req)

	beaconId := params.Get("beacon_id")
	if beaconId == "" {
		beaconId = vars["beacon_id"]
	}

	result, err := c.controller.GetBeaconById(
		params.Get("correlation_id"),
		beaconId)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) createBeacon(res http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	correlationId := params.Get("correlation_id")
	var beacon data1.BeaconV1

	body, bodyErr := ioutil.ReadAll(req.Body)
	if bodyErr != nil {
		err := cerr.NewInternalError(correlationId, "READ_ERR", "Can't read from body").WithCause(bodyErr)
		c.SendError(res, req, err)
		return
	}
	defer req.Body.Close()
	jsonErr := json.Unmarshal(body, &beacon)

	if jsonErr != nil {
		err := cerr.NewInternalError(correlationId, "JSON_CONVERT_ERR", "Can't convert from JSON to Beacons").WithCause(jsonErr)
		c.SendError(res, req, err)
		return
	}

	result, err := c.controller.CreateBeacon(
		correlationId,
		&beacon,
	)
	c.SendCreatedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) updateBeacon(res http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	correlationId := params.Get("correlation_id")

	var beacon data1.BeaconV1

	body, bodyErr := ioutil.ReadAll(req.Body)
	if bodyErr != nil {
		err := cerr.NewInternalError(correlationId, "READ_ERR", "Can't read from body").WithCause(bodyErr)
		c.SendError(res, req, err)
		return
	}
	defer req.Body.Close()
	jsonErr := json.Unmarshal(body, &beacon)

	if jsonErr != nil {
		err := cerr.NewInternalError(correlationId, "JSON_CONVERT_ERR", "Can't convert from JSON to Beacons").WithCause(jsonErr)
		c.SendError(res, req, err)
		return
	}
	result, err := c.controller.UpdateBeacon(
		correlationId,
		&beacon,
	)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) deleteBeaconById(res http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	vars := mux.Vars(req)

	beaconId := params.Get("beacon_id")
	if beaconId == "" {
		beaconId = vars["beacon_id"]
	}

	result, err := c.controller.DeleteBeaconById(
		params.Get("correlation_id"),
		beaconId,
	)
	c.SendDeletedResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) getBeaconByUdi(res http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	vars := mux.Vars(req)

	beaconUdi := params.Get("udi")
	if beaconUdi == "" {
		beaconUdi = vars["udi"]
	}

	result, err := c.controller.GetBeaconByUdi(
		params.Get("correlation_id"),
		beaconUdi)
	c.SendResult(res, req, result, err)
}

func (c *BeaconsRestServiceV1) calculatePosition(res http.ResponseWriter, req *http.Request) {

	params := req.URL.Query()
	correlationId := params.Get("correlation_id")

	bodyParams := make(map[string]interface{}, 0)

	body, bodyErr := ioutil.ReadAll(req.Body)
	if bodyErr != nil {
		err := cerr.NewInternalError(correlationId, "READ_ERR", "Can't read from body").WithCause(bodyErr)
		c.SendError(res, req, err)
		return
	}
	defer req.Body.Close()
	jsonErr := json.Unmarshal(body, &bodyParams)

	if jsonErr != nil {
		err := cerr.NewInternalError(correlationId, "JSON_CONVERT_ERR", "Can't convert from JSON to map").WithCause(jsonErr)
		c.SendError(res, req, err)
		return
	}

	udiValues, _ := bodyParams["udis"].([]interface{})
	udis := make([]string, 0, 0)
	for _, udi := range udiValues {
		v, _ := udi.(string)
		udis = append(udis, v)
	}
	siteId, _ := bodyParams["site_id"].(string)

	result, err := c.controller.CalculatePosition(
		correlationId,
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
