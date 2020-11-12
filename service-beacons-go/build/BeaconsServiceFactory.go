package build

import (
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	services1 "github.com/nov-pocs/samples/service-beacons-go/services/version1"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	cbuild "github.com/pip-services3-go/pip-services3-components-go/build"
)

type BeaconsServiceFactory struct {
	cbuild.Factory
}

func NewBeaconsServiceFactory() *BeaconsServiceFactory {
	c := &BeaconsServiceFactory{
		Factory: *cbuild.NewFactory(),
	}

	memoryPersistenceDescriptor := cref.NewDescriptor("beacons", "persistence", "memory", "*", "1.0")
	filePersistenceDescriptor := cref.NewDescriptor("beacons", "persistence", "file", "*", "1.0")
	postgresDbPersistenceDescriptor := cref.NewDescriptor("beacons", "persistence", "postgres", "*", "1.0")
	jsonPostgresDbPersistenceDescriptor := cref.NewDescriptor("beacons", "persistence", "json-postgres", "*", "1.0")
	controllerDescriptor := cref.NewDescriptor("beacons", "controller", "default", "*", "1.0")
	cmdHttpServiceV1Descriptor := cref.NewDescriptor("beacons", "service", "commandable-http", "*", "1.0")
	cmdGrpcServiceV1Descriptor := cref.NewDescriptor("beacons", "service", "commandable-grpc", "*", "1.0")
	httpServiceV1Descriptor := cref.NewDescriptor("beacons", "service", "http", "*", "1.0")

	c.RegisterType(memoryPersistenceDescriptor, persist.NewBeaconsMemoryPersistence)
	c.RegisterType(filePersistenceDescriptor, persist.NewBeaconsFilePersistence)
	c.RegisterType(postgresDbPersistenceDescriptor, persist.NewBeaconsPostgresPersistence)
	c.RegisterType(jsonPostgresDbPersistenceDescriptor, persist.NewBeaconsJsonPostgresPersistence)

	c.RegisterType(controllerDescriptor, logic.NewBeaconsController)
	c.RegisterType(cmdHttpServiceV1Descriptor, services1.NewBeaconsCommandableHttpServiceV1)
	c.RegisterType(cmdGrpcServiceV1Descriptor, services1.NewBeaconsCommandableGrpcServiceV1)
	c.RegisterType(httpServiceV1Descriptor, services1.NewBeaconsRestServiceV1)

	return c
}
