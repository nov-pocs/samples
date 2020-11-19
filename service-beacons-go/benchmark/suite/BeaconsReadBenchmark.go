package suite

import (
	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	rnd "github.com/pip-services3-go/pip-services3-commons-go/random"
)

type BeaconsReadBenchmark struct {
	*bench.Benchmark
	siteCount      int
	beaconsContext *BeaconsBenchmarkContext
}

func NewBeaconsReadBenchmark() *BeaconsReadBenchmark {
	c := BeaconsReadBenchmark{
		Benchmark: bench.NewBenchmark("ReadBeacons", "Measures performance of getBeacons operation", "Type"),
	}
	c.Benchmark.IExecutable = &c
	return &c
}

func (c *BeaconsReadBenchmark) SetUp() error {
	c.siteCount = c.GetContext().GetParameters()["SiteCount"].GetAsInteger()
	c.beaconsContext = NewBeaconsBenchmarkContext(c.GetContext())
	// Connext to the database
	return c.beaconsContext.Open()
}

func (c *BeaconsReadBenchmark) TearDown() error {
	// Disconnect from the database
	return c.beaconsContext.Close()
}

func (c *BeaconsReadBenchmark) Execute() error {
	siteId := cconv.StringConverter.ToString(rnd.RandomInteger.NextInteger(1, c.siteCount))

	_, err := c.beaconsContext.Controller.GetBeacons(
		"",
		cdata.NewFilterParamsFromTuples(
			"site_id", siteId,
		),
		cdata.NewPagingParams(0, 100, false),
	)

	return err
}
