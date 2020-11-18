package benchmark

import (
	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	logic "github.com/nov-pocs/samples/service-beacons-go/logic"
	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	conv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	rnd "github.com/pip-services3-go/pip-services3-commons-go/random"
	cref "github.com/pip-services3-go/pip-services3-commons-go/refer"
)

type BeaconsCalculateBenchmark struct {
	*bench.Benchmark
	persistence *persist.BeaconsPostgresPersistence
	controller  *logic.BeaconsController
}

func NewBeaconsCalculateBenchmark() *BeaconsCalculateBenchmark {
	c := BeaconsCalculateBenchmark{}
	c.Benchmark = bench.NewBenchmark("BeaconsCalculateBenchmark", "Measures performance of updating", "Type")
	c.Benchmark.IExecutable = &c

	c.persistence = persist.NewBeaconsPostgresPersistence()

	c.controller = logic.NewBeaconsController()
	c.controller.Configure(cconf.NewEmptyConfigParams())

	references := cref.NewReferencesFromTuples(
		cref.NewDescriptor("beacons", "persistence", "postgres", "default", "1.0"), c.persistence,
		cref.NewDescriptor("beacons", "controller", "default", "default", "1.0"), c.controller,
	)

	c.controller.SetReferences(references)

	return &c
}

func (c *BeaconsCalculateBenchmark) SetUp() error {

	dbConfig := cconf.NewConfigParamsFromTuples(
		"connection.uri", c.Context.GetParameters()["postgresUri"].GetAsString(),
		"connection.host", c.Context.GetParameters()["postgresHost"].GetAsString(),
		"connection.port", c.Context.GetParameters()["postgresPort"].GetAsString(),
		"connection.database", c.Context.GetParameters()["postgresDatabase"].GetAsString(),
		"credential.username", c.Context.GetParameters()["postgresUser"].GetAsString(),
		"credential.password", c.Context.GetParameters()["postgresPassword"].GetAsString(),
	)

	c.persistence.Configure(dbConfig)

	err := c.persistence.Open("")
	if err != nil {
		return err
	}
	return c.persistence.Clear("")
}

func (c *BeaconsCalculateBenchmark) TearDown() error {
	return c.persistence.Close("")
}

func (c *BeaconsCalculateBenchmark) Execute() error {
	_, err := c.controller.CreateBeacon("", c.generateRandomBeaconV1())
	if err != nil {
		c.Context.ReportError(err)
	}
	return err
}

func (c *BeaconsCalculateBenchmark) generateRandomType() string {

	i := rnd.RandomInteger.NextInteger(0, 4)
	var t string

	switch i {
	case 0:
		t = data1.Unknown
	case 1:
		t = data1.AltBeacon
	case 2:
		t = data1.IBeacon
	case 3:
		t = data1.EddyStoneUdi
	}
	return t
}

func (c *BeaconsCalculateBenchmark) generateRandomBeaconV1() *data1.BeaconV1 {

	beacon := &data1.BeaconV1{
		Udi:    "000" + conv.StringConverter.ToString(rnd.RandomInteger.NextInteger(0, 10)),
		Type:   c.generateRandomType(),
		SiteId: conv.StringConverter.ToString(rnd.RandomInteger.NextInteger(0, 20)),
		Label:  rnd.RandomString.NextString(5, 15),
		Center: data1.GeoPointV1{
			Type: "Point",
			Coordinates: [][]float32{
				{
					rnd.RandomFloat.NextFloat(0, 100),
					rnd.RandomFloat.NextFloat(0, 100),
				},
			},
		},
		Radius: rnd.RandomFloat.NextFloat(0, 100),
	}

	return beacon
}
