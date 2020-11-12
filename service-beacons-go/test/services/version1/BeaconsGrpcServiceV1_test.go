package test_services1

import (
	"context"
	"testing"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	protos "github.com/nov-pocs/samples/service-beacons-go/protos"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
)

type beaconsGrpcServiceV1Test struct {
	BEACON1     *data1.BeaconV1
	BEACON2     *data1.BeaconV1
	persistence *persist.BeaconsMemoryPersistence
	controller  *logic.BeaconsController
	service     *services1.BeaconsGrpcServiceV1
	client      protos.BeaconsV1Client
	connection  *grpc.ClientConn
}

func newBeaconsGrpcServiceV1Test() *beaconsGrpcServiceV1Test {
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

	service := services1.NewBeaconsGrpcServiceV1()
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

	return &beaconsGrpcServiceV1Test{
		BEACON1:     BEACON1,
		BEACON2:     BEACON2,
		persistence: persistence,
		controller:  controller,
		service:     service,
	}
}

func (c *beaconsGrpcServiceV1Test) setup(t *testing.T) {
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

	opts := []grpc.DialOption{
		grpc.WithInsecure(),
	}

	connection, err := grpc.Dial("localhost:3000", opts...)
	if err != nil {
		t.Error("Failed to creaate grpc connection", err)
	}

	c.connection = connection
	c.client = protos.NewBeaconsV1Client(c.connection)

}

func (c *beaconsGrpcServiceV1Test) teardown(t *testing.T) {
	err := c.service.Close("")
	if err != nil {
		t.Error("Failed to close service", err)
	}

	err = c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}

	err = c.connection.Close()
	if err != nil {
		t.Error("Failed to close grpc connection", err)
	}
}

func (c *beaconsGrpcServiceV1Test) testCrudOperations(t *testing.T) {
	var beacon1 *data1.BeaconV1

	// Create beacon
	var beacon data1.BeaconV1
	request := protos.BeaconV1ObjectRequest{
		Beacon: services1.FromBeacon(c.BEACON1),
	}
	result, err := c.client.CreateBeacon(context.TODO(), &request)
	beacon = *services1.ToBeacon(result.Beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON1.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON1.Type, beacon.Type)
	assert.Equal(t, c.BEACON1.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Create beacon
	request = protos.BeaconV1ObjectRequest{
		Beacon: services1.FromBeacon(c.BEACON2),
	}
	result, err = c.client.CreateBeacon(context.TODO(), &request)
	beacon = *services1.ToBeacon(result.Beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON2.Udi, beacon.Udi)
	assert.Equal(t, c.BEACON2.SiteId, beacon.SiteId)
	assert.Equal(t, c.BEACON2.Type, beacon.Type)
	assert.Equal(t, c.BEACON2.Label, beacon.Label)
	assert.NotNil(t, beacon.Center)

	// Get beacons
	pageRequest := protos.BeaconV1PageRequest{}
	pageResult, err := c.client.GetBeacons(context.TODO(), &pageRequest)
	assert.Nil(t, err)
	assert.NotNil(t, pageResult)
	assert.Len(t, pageResult.Page.Data, 2)
	beacon1 = services1.ToBeacon(pageResult.Page.Data[0])

	// Update the beacon
	beacon1.Label = "ABC"
	request = protos.BeaconV1ObjectRequest{
		Beacon: services1.FromBeacon(beacon1),
	}
	result, err = c.client.UpdateBeacon(context.TODO(), &request)
	beacon = *services1.ToBeacon(result.Beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)
	assert.Equal(t, "ABC", beacon.Label)

	// Get beacon by udi
	udiRequest := protos.BeaconV1UdiRequest{
		BeaconUdi: beacon1.Udi,
	}
	result, err = c.client.GetBeaconByUdi(context.TODO(), &udiRequest)
	beacon = *services1.ToBeacon(result.Beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	//Calculate position for one beacon
	posRequest := protos.BeaconV1PositionRequest{
		SiteId: "1",
		Udis:   []string{"00001"},
	}

	posResult, err := c.client.CalculatePosition(context.TODO(), &posRequest)
	position := services1.ToPosition(posResult.Point)
	assert.Nil(t, err)
	assert.NotNil(t, position)
	assert.Equal(t, "Point", position.Type)
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][0])
	assert.Equal(t, (float32)(0.0), position.Coordinates[0][1])

	// Delete beacon
	delRequest := protos.BeaconV1IdRequest{
		BeaconId: beacon1.Id,
	}
	result, err = c.client.DeleteBeaconById(context.TODO(), &delRequest)
	beacon = *services1.ToBeacon(result.Beacon)
	assert.Nil(t, err)
	assert.NotNil(t, beacon)
	assert.Equal(t, c.BEACON1.Id, beacon.Id)

	// Try get beacon
	result, err = c.client.GetBeaconById(context.TODO(), &delRequest)
	assert.Nil(t, err)
	assert.Nil(t, services1.ToBeacon(result.Beacon))
}

func TestBeaconsGrpcServiceV1(t *testing.T) {
	c := newBeaconsGrpcServiceV1Test()

	c.setup(t)
	t.Run("CRUD Operations", c.testCrudOperations)
	c.teardown(t)
}
