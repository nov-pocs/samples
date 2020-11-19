package benchmark

import (
	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
	cconv "github.com/pip-services3-go/pip-services3-commons-go/convert"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
)

type BeaconsBenchmarkSuite struct {
	*bench.BenchmarkSuite
}

func NewBeaconsBenchmarkSuite() *BeaconsBenchmarkSuite {
	c := BeaconsBenchmarkSuite{
		BenchmarkSuite: bench.NewBenchmarkSuite("Beacons", "Beacons benchmark"),
	}
	// Override prepare methods
	c.IPrepared = &c

	c.CreateParameter("RecordCount", "Number of records at start", "0")
	c.CreateParameter("SiteCount", "Number of field sites", "100")
	c.CreateParameter("DatabaseType", "Database type", "postgres")
	c.CreateParameter("DatabaseUri", "Database URI", "")
	c.CreateParameter("DatabaseHost", "Database hostname", "localhost")
	c.CreateParameter("DatabasePort", "Database port", "5432")
	c.CreateParameter("DatabaseName", "Database name", "test")
	c.CreateParameter("DatabaseUser", "Database username", "postgres")
	c.CreateParameter("DatabasePassword", "Database password", "postgres")

	c.AddBenchmark(NewBeaconsCalculateBenchmark().Benchmark)
	c.AddBenchmark(NewBeaconsReadBenchmark().Benchmark)

	return &c
}

func (c *BeaconsBenchmarkSuite) SetUp() error {

	totalCount := c.GetContext().GetParameters()["RecordCount"].GetAsInteger()
	siteCount := c.GetContext().GetParameters()["SiteCount"].GetAsInteger()
	currentCount := 0
	context := NewBeaconsBenchmarkContext(c.GetContext())

	// Connect to the database
	err := context.Open()
	if err != nil {
		return err
	}
	// Get number of records in the database
	page, err := context.Persistence.GetPageByFilter(
		"",
		nil,
		cdata.NewPagingParams(0, 1, true))
	if err != nil {
		return err
	}

	if page != nil && page.Total != nil {
		currentCount = (int)(*page.Total)
	}

	// Generate initial records
	if currentCount < totalCount {
		c.GetContext().SendMessage("Creating " + cconv.StringConverter.ToString((totalCount - currentCount)) + " beacons...")
		for currentCount < totalCount {
			beacon := data1.RandomBeaconV1.NextBeacon(siteCount)
			_, err = context.Persistence.Create("", &beacon)
			if err != nil {
				return err
			}
			currentCount++

			if currentCount%100 == 0 {
				c.GetContext().SendMessage("Created " + cconv.StringConverter.ToString(currentCount) + " beacons")
			}
		}
		c.GetContext().SendMessage("Initial beacons successfully created.")
	}
	// Disconnect from the database
	return context.Close()
}

func (c *BeaconsBenchmarkSuite) TearDown() error {
	return nil
}
