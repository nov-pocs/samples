package suite

import (
	"os"
	"strings"

	benchconsole "github.com/pip-benchmark/pip-benchmark-go/console"
	runner "github.com/pip-benchmark/pip-benchmark-go/runner"
)

type BeaconsBenchmarkBuilder struct {
	*benchconsole.ConsoleBenchmarkBuilder
}

func NewBeaconsBenchmarkBuilder() *BeaconsBenchmarkBuilder {
	c := &BeaconsBenchmarkBuilder{
		ConsoleBenchmarkBuilder: benchconsole.NewConsoleBenchmarkBuilder(),
	}
	c.AddSuite(NewBeaconsBenchmarkSuite().BenchmarkSuite)
	c.setEnvParameters()
	return c
}

func (c *BeaconsBenchmarkBuilder) setEnvParameters() *BeaconsBenchmarkBuilder {
	databaseType := os.Getenv("DATABASE_TYPE")
	if databaseType == "" {
		databaseType = "postgres"
	}
	DB := strings.ToUpper(databaseType)

	recordCount := os.Getenv("BENCHMARK_RECORDS")
	if recordCount == "" {
		recordCount = "1000"
	}
	c.WithParameter("Beacons.RecordCount", recordCount)

	siteCount := os.Getenv("BENCHMARK_SITES")
	if siteCount == "" {
		siteCount = "100"
	}
	c.WithParameter("Beacons.SiteCount", siteCount)
	c.WithParameter("Beacons.DatabaseUri", os.Getenv(DB+"_SERVICE_URI"))

	databaseHost := os.Getenv(DB + "_SERVICE_HOST")
	if databaseHost == "" {
		databaseHost = "localhost"
	}
	c.WithParameter("Beacons.DatabaseHost", databaseHost)

	databasePort := os.Getenv(DB + "_SERVICE_PORT")
	if databasePort == "" {
		databasePort = "5432"
	}
	c.WithParameter("Beacons.DatabasePort", databasePort)

	databaseName := os.Getenv(DB + "_DB")
	if databaseName == "" {
		databaseName = "test"
	}
	c.WithParameter("Beacons.DatabaseName", databaseName)

	databaseUser := os.Getenv(DB + "_USER")
	if databaseUser == "" {
		databaseUser = "postgres"
	}
	c.WithParameter("Beacons.DatabaseUser", databaseUser)
	databasePassword := os.Getenv(DB + "_PASS")
	if databasePassword == "" {
		databasePassword = "postgres"
	}
	c.WithParameter("Beacons.DatabasePassword", databasePassword)

	return c
}

func (c *BeaconsBenchmarkBuilder) ForPerformanceTesting() *BeaconsBenchmarkBuilder {
	c.ForceContinue(false)
	c.MeasureAs(runner.Peak)
	c.ExecuteAs(runner.Sequential)

	c.WithBenchmark("Beacons.CalculatePosition")
	c.WithBenchmark("Beacons.ReadBeacons")

	c.ForDuration(10) //1 * 3600); // Run for 1 minute

	return c
}

func (c *BeaconsBenchmarkBuilder) ForReliabilityTesting() *BeaconsBenchmarkBuilder {
	c.ForceContinue(true)
	c.MeasureAs(runner.Nominal)
	c.WithNominalRate(100)
	c.ExecuteAs(runner.Proportional)

	c.WithProportionalBenchmark("Beacons.CalculatePosition", 70)
	c.WithProportionalBenchmark("Beacons.ReadBeacons", 10)

	c.ForDuration(24 * 60 * 3600) // Run for 24 hours

	return c
}

func (c *BeaconsBenchmarkBuilder) ForScalabilityTesting() *BeaconsBenchmarkBuilder {
	c.ForceContinue(true)
	c.MeasureAs(runner.Peak)
	c.ExecuteAs(runner.Proportional)

	c.WithProportionalBenchmark("Beacons.CalculatePosition", 70)
	c.WithProportionalBenchmark("Beacons.ReadBeacons", 10)

	c.ForDuration(15 * 3600) // Run for 15 minutes

	return c
}
