package benchmark

import (
	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	rnd "github.com/pip-services3-go/pip-services3-commons-go/random"
)

type BeaconsCalculateBenchmark struct {
	*bench.Benchmark
	siteId         string
	udis           []string
	beaconsContext *BeaconsBenchmarkContext
}

func NewBeaconsCalculateBenchmark() *BeaconsCalculateBenchmark {
	c := BeaconsCalculateBenchmark{
		Benchmark: bench.NewBenchmark("CalculatePosition", "Measures performance of calculatePosition operation", "Type"),
		udis:      make([]string, 0),
	}
	c.Benchmark.IExecutable = &c

	return &c
}

func (c *BeaconsCalculateBenchmark) SetUp() error {

	siteCount := c.GetContext().GetParameters()["SiteCount"].GetAsInteger()
	c.siteId = data1.RandomBeaconV1.NextSiteId(siteCount)

	c.beaconsContext = NewBeaconsBenchmarkContext(c.GetContext())

	// Connext to the database
	err := c.beaconsContext.Open()
	if err != nil {
		return err
	}

	// Get beacon udis
	page, err := c.beaconsContext.Persistence.GetPageByFilter(
		"",
		cdata.NewFilterParamsFromTuples(
			"site_id", c.siteId,
		),
		cdata.NewPagingParams(0, 100, false))
	if err != nil {
		return err
	}
	if page != nil {
		for _, item := range page.Data {
			c.udis = append(c.udis, item.Udi)
		}
	}

	return nil
}

func (c *BeaconsCalculateBenchmark) TearDown() error {
	// Disconnect from the database
	return c.beaconsContext.Close()
}

func (c *BeaconsCalculateBenchmark) Execute() error {
	udis := c.NextUdis()
	if c.beaconsContext != nil {
		_, err := c.beaconsContext.Controller.CalculatePosition(
			"", c.siteId, udis,
		)
		return err
	}
	return nil
}

func (c *BeaconsCalculateBenchmark) NextUdis() []string {

	udiCount := rnd.RandomInteger.NextInteger(0, 10)
	remainingUdis := make([]string, 0)
	remainingUdis = append(remainingUdis, c.udis...)
	udis := make([]string, 0)

	for udiCount > 0 && len(remainingUdis) > 0 {
		index := rnd.RandomInteger.NextInteger(0, len(remainingUdis)-1)
		udis = append(udis, remainingUdis[index])

		if index == len(remainingUdis) {
			remainingUdis = remainingUdis[:index-1]
		} else {
			remainingUdis = append(remainingUdis[:index], remainingUdis[index+1:]...)
		}
	}
	return udis
}
