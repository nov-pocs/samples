package benchmark

import (
	bbuild "github.com/nov-pocs/samples/service-beacons-go/build"
	blogic "github.com/nov-pocs/samples/service-beacons-go/logic"
	bpersist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
	crun "github.com/pip-services3-go/pip-services3-commons-go/run"
)

type BeaconsBenchmarkContext struct {
	baseContext bench.IExecutionContext
	Persistence bpersist.IBeaconsPersistence
	Controller  *blogic.BeaconsController
}

func NewBeaconsBenchmarkContext(baseContext bench.IExecutionContext) *BeaconsBenchmarkContext {
	return &BeaconsBenchmarkContext{
		baseContext: baseContext,
	}
}

func (c *BeaconsBenchmarkContext) Open() error {
	databaseType := c.baseContext.GetParameters()["DatabaseType"].GetAsString()
	databaseUri := c.baseContext.GetParameters()["DatabaseUri"].GetAsString()
	databaseHost := c.baseContext.GetParameters()["DatabaseHost"].GetAsString()
	databasePort := c.baseContext.GetParameters()["DatabasePort"].GetAsInteger()
	databaseName := c.baseContext.GetParameters()["DatabaseName"].GetAsString()
	databaseUser := c.baseContext.GetParameters()["DatabaseUser"].GetAsString()
	databasePassword := c.baseContext.GetParameters()["DatabasePassword"].GetAsString()

	persistenceDescriptor := cref.NewDescriptor("beacons", "persistence", databaseType, "*", "1.0")
	instance, err := bbuild.NewBeaconsServiceFactory().Create(persistenceDescriptor)
	if err != nil {
		return err
	}
	c.Persistence, _ = instance.(bpersist.IBeaconsPersistence)
	c.Persistence.(cconf.IConfigurable).Configure(cconf.NewConfigParamsFromTuples(
		"connection.uri", databaseUri,
		"connection.host", databaseHost,
		"connection.port", databasePort,
		"connection.database", databaseName,
		"credential.username", databaseUser,
		"credential.password", databasePassword,
	))

	c.Controller = blogic.NewBeaconsController()
	c.Controller.Configure(cconf.NewEmptyConfigParams())

	references := cref.NewReferencesFromTuples(
		cref.NewDescriptor("beacons", "persistence", databaseType, "default", "1.0"), c.Persistence,
		cref.NewDescriptor("pip-services-positions", "controller", "default", "default", "1.0"), c.Controller,
	)
	c.Controller.SetReferences(references)
	return c.Persistence.(crun.IOpenable).Open("")
}

func (c *BeaconsBenchmarkContext) Close() error {
	return c.Persistence.(crun.IClosable).Close("")
}
