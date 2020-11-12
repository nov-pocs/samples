package test_services1

import (
	"context"
	"encoding/json"
	"testing"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cmdproto "github.com/pip-services3-go/pip-services3-grpc-go/protos"
	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
	"google.golang.org/grpc/grpclog"
)

type beaconsCommandableGrpcServiceV1Test struct {
	BEACON1     *data1.BeaconV1
	BEACON2     *data1.BeaconV1
	persistence *persist.BeaconsMemoryPersistence
	controller  *logic.BeaconsController
	service     *services1.BeaconsCommandableGrpcServiceV1
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

	persistence := persist.NewBeaconsMemoryPersistence()
	persistence.Configure(cconf.NewEmptyConfigParams())

	controller := logic.NewBeaconsController()
	controller.Configure(cconf.NewEmptyConfigParams())

	service := services1.NewBeaconsCommandableGrpcServiceV1()
	service.Configure(cconf.NewConfigParamsFromTuples(
		"connection.protocol", "http",
		"connection.port", "3002",
		"connection.host", "localhost",
	))

	references := cref.NewReferencesFromTuples(
		cref.NewDescriptor("beacons", "persistence", "memory", "default", "1.0"), persistence,
		cref.NewDescriptor("beacons", "controller", "default", "default", "1.0"), controller,
		cref.NewDescriptor("beacons", "service", "grpc", "default", "1.0"), service,
	)

	controller.SetReferences(references)
	service.SetReferences(references)

	return &beaconsCommandableGrpcServiceV1Test{
		BEACON1:     BEACON1,
		BEACON2:     BEACON2,
		persistence: persistence,
		controller:  controller,
		service:     service,
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
}

func (c *beaconsCommandableGrpcServiceV1Test) teardown(t *testing.T) {
	err := c.service.Close("")
	if err != nil {
		t.Error("Failed to close service", err)
	}

	err = c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func (c *beaconsCommandableGrpcServiceV1Test) testCrudOperations(t *testing.T) {
	var client cmdproto.CommandableClient

	opts := []grpc.DialOption{
		grpc.WithInsecure(),
	}
	conn, err := grpc.Dial("localhost:3002", opts...)
	if err != nil {
		grpclog.Fatalf("fail to dial: %v", err)
	}
	defer conn.Close()
	client = cmdproto.NewCommandableClient(conn)

	var beacon1 data1.BeaconV1
	// Create the first beacon
	requestParams := make(map[string]interface{})
	requestParams["beacon"] = c.BEACON1
	jsonBuf, _ := json.Marshal(requestParams)

	request := cmdproto.InvokeRequest{}
	request.Method = "v1.beacons.create_beacon"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err := client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)
	var beacon data1.BeaconV1
	jsonErr := json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON1.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON1.Type, beacon.Type)
	assert.Equal(t, c.BEACON1.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Create the second beacon
	requestParams = make(map[string]interface{})
	requestParams["beacon"] = c.BEACON2
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.create_beacon"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	jsonErr = json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON2.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON2.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON2.Type, beacon.Type)
	assert.Equal(t, c.BEACON2.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Get all beacons
	request.Method = "v1.beacons.get_beacons"
	request.ArgsEmpty = false
	request.ArgsJson = "{}"
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	var page data1.BeaconV1DataPage
	jsonErr = json.Unmarshal([]byte(response.ResultJson), &page)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, page)
	assert.Len(t, page.Data, 2)
	beacon1 = *page.Data[0]

	// Update the beacon
	beacon1.Label = "ABC"
	requestParams = make(map[string]interface{})
	requestParams["beacon"] = beacon1
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.update_beacon"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	jsonErr = json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)
	assert.Equal(t, "ABC", beacon.Label)

	// Get beacon by udi
	requestParams = make(map[string]interface{})
	requestParams["udi"] = beacon1.Udi
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.get_beacon_by_udi"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	jsonErr = json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Calculate position for one beacon
	requestParams = make(map[string]interface{})
	requestParams["site_id"] = "1"
	requestParams["udis"] = []string{"00001"}
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.calculate_position"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	var position data1.GeoPointV1
	jsonErr = json.Unmarshal([]byte(response.ResultJson), &position)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)

	assert.NotNil(t, position)
	assert.Equal(t, "Point", position.Type)
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][0])
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][1])

	// Delete the beacon
	requestParams = make(map[string]interface{})
	requestParams["beacon_id"] = beacon1.Id
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.delete_beacon_by_id"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	jsonErr = json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Try to get deleted beacon
	requestParams = make(map[string]interface{})
	requestParams["beacon_id"] = beacon1.Id
	jsonBuf, _ = json.Marshal(requestParams)

	request.Method = "v1.beacons.get_beacon_by_id"
	request.ArgsEmpty = false
	request.ArgsJson = string(jsonBuf)
	response, err = client.Invoke(context.TODO(), &request)
	assert.Nil(t, err)

	beacon = data1.BeaconV1{}

	jsonErr = json.Unmarshal([]byte(response.ResultJson), &beacon)
	assert.Nil(t, jsonErr)
	assert.NotNil(t, beacon)
	assert.Empty(t, beacon)
}

func TestBeaconsCommmandableGrpcServiceV1(t *testing.T) {
	c := newBeaconsCommandableGrpcServiceV1Test()

	c.setup(t)
	t.Run("CRUD Operations", c.testCrudOperations)
	c.teardown(t)
}
