package test_services1

import (
	"reflect"
	"testing"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cclients "github.com/pip-services3-go/pip-services3-grpc-go/clients"
	"github.com/stretchr/testify/assert"
)

var (
	BeaconV1DataPageType reflect.Type = reflect.TypeOf(&data1.BeaconV1DataPage{})
	BeaconV1Type         reflect.Type = reflect.TypeOf(&data1.BeaconV1{})
	GeoPointV1Type       reflect.Type = reflect.TypeOf(&data1.GeoPointV1{})
)

type testGrpcClient struct {
	*cclients.CommandableGrpcClient
}

func newTestGrpcClient() *testGrpcClient {
	c := &testGrpcClient{
		CommandableGrpcClient: cclients.NewCommandableGrpcClient("v1.beacons"),
	}
	return c
}

type beaconsCommandableGrpcServiceV1Test struct {
	BEACON1     *data1.BeaconV1
	BEACON2     *data1.BeaconV1
	persistence *persist.BeaconsMemoryPersistence
	controller  *logic.BeaconsController
	service     *services1.BeaconsCommandableGrpcServiceV1
	client      *testGrpcClient
}

func newBeaconsCommandableGrpcServiceV1Test() *beaconsCommandableGrpcServiceV1Test {
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

	grpcConf := cconf.NewConfigParamsFromTuples(
		"connection.protocol", "http",
		"connection.port", "3002",
		"connection.host", "localhost",
	)

	persistence := persist.NewBeaconsMemoryPersistence()
	persistence.Configure(cconf.NewEmptyConfigParams())

	controller := logic.NewBeaconsController()
	controller.Configure(cconf.NewEmptyConfigParams())

	service := services1.NewBeaconsCommandableGrpcServiceV1()
	service.Configure(grpcConf)

	references := cref.NewReferencesFromTuples(
		cref.NewDescriptor("beacons", "persistence", "memory", "default", "1.0"), persistence,
		cref.NewDescriptor("beacons", "controller", "default", "default", "1.0"), controller,
		cref.NewDescriptor("beacons", "service", "grpc", "default", "1.0"), service,
	)

	controller.SetReferences(references)
	service.SetReferences(references)

	var client *testGrpcClient

	client = newTestGrpcClient()

	client.Configure(grpcConf)

	return &beaconsCommandableGrpcServiceV1Test{
		BEACON1:     BEACON1,
		BEACON2:     BEACON2,
		persistence: persistence,
		controller:  controller,
		service:     service,
		client:      client,
	}
}

func (c *beaconsCommandableGrpcServiceV1Test) setup(t *testing.T) {
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

	err = c.client.Open("")
	if err != nil {
		t.Error("Failed to open client", err)
	}
}

func (c *beaconsCommandableGrpcServiceV1Test) teardown(t *testing.T) {

	err := c.client.Close("")
	if err != nil {
		t.Error("Failed to close client", err)
	}

	err = c.service.Close("")
	if err != nil {
		t.Error("Failed to close service", err)
	}

	err = c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func (c *beaconsCommandableGrpcServiceV1Test) testCrudOperations(t *testing.T) {

	var beacon1 data1.BeaconV1
	// Create the first beacon

	params := cdata.NewAnyValueMapFromTuples(
		"beacon", c.BEACON1,
	)
	res, err := c.client.CallCommand(BeaconV1Type, "create_beacon", "", params)
	assert.Nil(t, err)
	var beacon *data1.BeaconV1
	beacon, _ = res.(*data1.BeaconV1)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON1.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON1.Type, beacon.Type)
	assert.Equal(t, c.BEACON1.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Create the second beacon
	params = cdata.NewAnyValueMapFromTuples(
		"beacon", c.BEACON2,
	)
	res, err = c.client.CallCommand(BeaconV1Type, "create_beacon", "", params)
	assert.Nil(t, err)
	beacon, _ = res.(*data1.BeaconV1)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON2.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON2.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON2.Type, beacon.Type)
	assert.Equal(t, c.BEACON2.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Get all beacons
	params = cdata.NewAnyValueMapFromTuples(
		"filter", cdata.NewEmptyFilterParams(),
		"paging", cdata.NewEmptyPagingParams(),
	)
	res, err = c.client.CallCommand(BeaconV1DataPageType, "get_beacons", "", params)
	assert.Nil(t, err)
	var page *data1.BeaconV1DataPage
	page, _ = res.(*data1.BeaconV1DataPage)
	assert.NotNil(t, page)
	assert.Len(t, page.Data, 2)
	beacon1 = *page.Data[0]

	// Update the beacon
	beacon1.Label = "ABC"
	params = cdata.NewAnyValueMapFromTuples(
		"beacon", beacon1,
	)
	res, err = c.client.CallCommand(BeaconV1Type, "update_beacon", "", params)
	assert.Nil(t, err)
	beacon, _ = res.(*data1.BeaconV1)
	assert.NotNil(t, beacon)
	assert.Equal(t, beacon1.Id, beacon.Id)
	assert.Equal(t, "ABC", beacon.Label)

	// Get beacon by udi
	params = cdata.NewAnyValueMapFromTuples(
		"udi", beacon1.Udi,
	)
	res, err = c.client.CallCommand(BeaconV1Type, "get_beacon_by_udi", "", params)
	assert.Nil(t, err)
	beacon, _ = res.(*data1.BeaconV1)
	assert.NotNil(t, beacon)
	assert.Equal(t, beacon1.Id, beacon.Id)

	// Calculate position for one beacon
	params = cdata.NewAnyValueMapFromTuples(
		"site_id", "1",
		"udis", []string{"00001"},
	)
	res, err = c.client.CallCommand(GeoPointV1Type, "calculate_position", "", params)
	assert.Nil(t, err)
	var position *data1.GeoPointV1
	position, _ = res.(*data1.GeoPointV1)
	assert.NotNil(t, position)
	assert.Equal(t, "Point", position.Type)
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][0])
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][1])

	// Delete the beacon
	params = cdata.NewAnyValueMapFromTuples(
		"beacon_id", beacon1.Id,
	)
	res, err = c.client.CallCommand(BeaconV1Type, "delete_beacon_by_id", "", params)
	assert.Nil(t, err)
	beacon, _ = res.(*data1.BeaconV1)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Try to get deleted beacon
	params = cdata.NewAnyValueMapFromTuples(
		"beacon_id", beacon1.Id,
	)
	res, err = c.client.CallCommand(BeaconV1Type, "get_beacon_by_id", "", params)
	assert.Nil(t, err)

	beacon, _ = res.(*data1.BeaconV1)
	assert.Nil(t, beacon)
}

func TestBeaconsCommmandableGrpcServiceV1(t *testing.T) {
	c := newBeaconsCommandableGrpcServiceV1Test()

	c.setup(t)
	t.Run("CRUD Operations", c.testCrudOperations)
	c.teardown(t)

}
