package test_services1

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"testing"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cerr "github.com/pip-services3-go/pip-services3-commons-go/errors"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	"github.com/stretchr/testify/assert"
)

type beaconsCommandableHttpServiceV1Test struct {
	BEACON1     *data1.BeaconV1
	BEACON2     *data1.BeaconV1
	persistence *persist.BeaconsMemoryPersistence
	controller  *logic.BeaconsController
	service     *services1.BeaconsCommandableHttpServiceV1
}

func newBeaconsCommandableHttpServiceV1Test() *beaconsCommandableHttpServiceV1Test {
	BEACON1 := &data1.BeaconV1{
		Id:     "1",
		Udi:    "00001",
		Type:   data1.AltBeacon,
		SiteId: "1",
		Label:  "TestBeacon1",
		Center: data1.GeoPointV1{Type: "Point", Coordinates: [][]float32{{0.0, 0.0}}},
		Radius: 50,
	}

	BEACON2 := &data1.BeaconV1{
		Id:     "2",
		Udi:    "00002",
		Type:   data1.IBeacon,
		SiteId: "1",
		Label:  "TestBeacon2",
		Center: data1.GeoPointV1{Type: "Point", Coordinates: [][]float32{{2.0, 2.0}}},
		Radius: 70,
	}

	persistence := persist.NewBeaconsMemoryPersistence()
	persistence.Configure(cconf.NewEmptyConfigParams())

	controller := logic.NewBeaconsController()
	controller.Configure(cconf.NewEmptyConfigParams())

	service := services1.NewBeaconsCommandableHttpServiceV1()
	service.Configure(cconf.NewConfigParamsFromTuples(
		"connection.protocol", "http",
		"connection.port", "3000",
		"connection.host", "localhost",
	))

	references := cref.NewReferencesFromTuples(
		cref.NewDescriptor("beacons", "persistence", "memory", "default", "1.0"), persistence,
		cref.NewDescriptor("beacons", "controller", "default", "default", "1.0"), controller,
		cref.NewDescriptor("beacons", "service", "http", "default", "1.0"), service,
	)

	controller.SetReferences(references)
	service.SetReferences(references)

	return &beaconsCommandableHttpServiceV1Test{
		BEACON1:     BEACON1,
		BEACON2:     BEACON2,
		persistence: persistence,
		controller:  controller,
		service:     service,
	}
}

func (c *beaconsCommandableHttpServiceV1Test) setup(t *testing.T) {
	err := c.persistence.Open("")
	if err != nil {
		t.Error("Failed to open persistence", err)
	}

	err = c.service.Open("")
	if err != nil {
		t.Error("Failed to open service", err)
	}

	err = c.persistence.Clear("")
	if err != nil {
		t.Error("Failed to clear persistence", err)
	}
}

func (c *beaconsCommandableHttpServiceV1Test) teardown(t *testing.T) {
	err := c.service.Close("")
	if err != nil {
		t.Error("Failed to close service", err)
	}

	err = c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func (c *beaconsCommandableHttpServiceV1Test) testCrudOperations(t *testing.T) {
	var beacon1 *data1.BeaconV1

	// Create the first beacon
	body := cdata.NewAnyValueMapFromTuples(
		"beacon", c.BEACON1,
	)
	var beacon data1.BeaconV1
	err := c.invoke("/v1/beacons/create_beacon", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON1.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON1.Type, beacon.Type)
	assert.Equal(t, c.BEACON1.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Create the second beacon
	body = cdata.NewAnyValueMapFromTuples(
		"beacon", c.BEACON2,
	)
	err = c.invoke("/v1/beacons/create_beacon", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON2.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON2.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON2.Type, beacon.Type)
	assert.Equal(t, c.BEACON2.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Get all beacons
	body = cdata.NewAnyValueMapFromTuples(
		"filter", cdata.NewEmptyFilterParams(),
		"paging", cdata.NewEmptyFilterParams(),
	)
	var page data1.BeaconV1DataPage
	err = c.invoke("/v1/beacons/get_beacons", body, &page)
	assert.Nil(t, err)
	assert.NotNil(t, page)
	assert.Len(t, page.Data, 2)
	beacon1 = page.Data[0]

	// Update the beacon
	beacon1.Label = "ABC"
	body = cdata.NewAnyValueMapFromTuples(
		"beacon", beacon1,
	)
	err = c.invoke("/v1/beacons/update_beacon", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)
	assert.Equal(t, "ABC", beacon.Label)

	// Get beacon by udi
	body = cdata.NewAnyValueMapFromTuples(
		"udi", beacon1.Udi,
	)
	err = c.invoke("/v1/beacons/get_beacon_by_udi", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Calculate position for one beacon
	body = cdata.NewAnyValueMapFromTuples(
		"site_id", "1",
		"udis", []string{"00001"},
	)
	var position data1.GeoPointV1
	err = c.invoke("/v1/beacons/calculate_position", body, &position)
	assert.Nil(t, err)
	assert.NotNil(t, position)
	assert.Equal(t, "Point", position.Type)
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][0])
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][1])

	// Delete the beacon
	body = cdata.NewAnyValueMapFromTuples(
		"beacon_id", beacon1.Id,
	)
	err = c.invoke("/v1/beacons/delete_beacon_by_id", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Try to get deleted beacon
	body = cdata.NewAnyValueMapFromTuples(
		"beacon_id", beacon1.Id,
	)
	beacon = data1.BeaconV1{}
	err = c.invoke("/v1/beacons/get_beacon_by_id", body, &beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Empty(t, beacon)
}

func (c *beaconsCommandableHttpServiceV1Test) invoke(
	route string, body *cdata.AnyValueMap, result interface{}) error {
	var url string = "http://localhost:3000" + route

	var bodyReader *bytes.Reader = nil
	if body != nil {
		jsonBody, _ := json.Marshal(body.Value())
		bodyReader = bytes.NewReader(jsonBody)
	}

	postResponse, postErr := http.Post(url, "application/json", bodyReader)

	if postErr != nil {
		return postErr
	}

	if postResponse.StatusCode == 204 {
		return nil
	}

	resBody, bodyErr := ioutil.ReadAll(postResponse.Body)
	if bodyErr != nil {
		return bodyErr
	}

	if postResponse.StatusCode >= 400 {
		appErr := cerr.ApplicationError{}
		json.Unmarshal(resBody, &appErr)
		return &appErr
	}

	if result == nil {
		return nil
	}

	jsonErr := json.Unmarshal(resBody, result)
	return jsonErr
}

func TestBeaconsCommmandableHttpServiceV1(t *testing.T) {
	c := newBeaconsCommandableHttpServiceV1Test()

	c.setup(t)
	t.Run("CRUD Operations", c.testCrudOperations)
	c.teardown(t)
}
