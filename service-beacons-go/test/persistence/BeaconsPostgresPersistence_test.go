package test_persistence

import (
	"os"
	"testing"

	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
)

type BeaconsPostgresPersistenceTest struct {
	persistence *persist.BeaconsPostgresPersistence
	fixture     BeaconsPersistenceFixture
}

func NewBeaconsPostgresPersistenceTest() *BeaconsPostgresPersistenceTest {
	var persistence *persist.BeaconsPostgresPersistence
	var fixture BeaconsPersistenceFixture

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

	if postgresUri == "" && postgresHost == "" {
		return nil
	}

	dbConfig := cconf.NewConfigParamsFromTuples(
		"connection.uri", postgresUri,
		"connection.host", postgresHost,
		"connection.port", postgresPort,
		"connection.database", postgresDatabase,
		"credential.username", postgresUser,
		"credential.password", postgresPassword,
	)

	persistence = persist.NewBeaconsPostgresPersistence()
	fixture = *NewBeaconsPersistenceFixture(persistence)
	persistence.Configure(dbConfig)

	return &BeaconsPostgresPersistenceTest{
		persistence: persistence,
		fixture:     fixture,
	}
}

func (c *BeaconsPostgresPersistenceTest) Setup(t *testing.T) {
	err := c.persistence.Open("")
	if err != nil {
		t.Error("Failed to open persistence", err)
	}

	err = c.persistence.Clear("")
	if err != nil {
		t.Error("Failed to clear persistence", err)
	}
}

func (c *BeaconsPostgresPersistenceTest) Teardown(t *testing.T) {
	err := c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func TestBeaconsPostgresPersistence(t *testing.T) {
	c := NewBeaconsPostgresPersistenceTest()
	if c == nil {
		return
	}

	c.Setup(t)
	t.Run("CRUD Operations", c.fixture.TestCrudOperations)
	c.Teardown(t)

	c.Setup(t)
	t.Run("Get With Filters", c.fixture.TestGetWithFilters)
	c.Teardown(t)
}
