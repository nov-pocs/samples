package benchmark

import (
	"os"

	bench "github.com/pip-benchmark/pip-benchmark-go/benchmark"
)

type BeaconsBenchmarkSuite struct {
	*bench.BenchmarkSuite
}

func NewBeaconsBenchmarkSuite() *BeaconsBenchmarkSuite {
	c := BeaconsBenchmarkSuite{}
	c.BenchmarkSuite = bench.NewBenchmarkSuite("Beacons", "Provides beacons benchmarks")

	postgresUri := os.Getenv("POSTGRES_SERVICE_URI")
	postgresHost := os.Getenv("POSTGRES_SERVICE_HOST")
	if postgresHost == "" {
		postgresHost = "localhost"
	}

	postgresPort := os.Getenv("POSTGRES_SERVICE_PORT")
	if postgresPort == "" {
		postgresPort = "5432"
	}

	postgresDatabase := os.Getenv("POSTGRES_DB")
	if postgresDatabase == "" {
		postgresDatabase = "test"
	}

	postgresUser := os.Getenv("POSTGRES_USER")
	if postgresUser == "" {
		postgresUser = "postgres"
	}

	postgresPassword := os.Getenv("POSTGRES_PASS")
	if postgresPassword == "" {
		postgresPassword = "postgres"
	}

	c.CreateParameter("postgresUri", "Postgres URI", postgresUri)
	c.CreateParameter("postgresHost", "Postgres host", postgresHost)
	c.CreateParameter("postgresPort", "Postgres port", postgresPort)
	c.CreateParameter("postgresDatabase", "Postgres database", postgresDatabase)
	c.CreateParameter("postgresUser", "Postgres user", postgresUser)
	c.CreateParameter("postgresPassword", "Postgres password", postgresPassword)

	c.AddBenchmark(NewBeaconsCalculateBenchmark().Benchmark)
	return &c
}
