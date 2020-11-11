package test_persistence

import (
	"os"
	"testing"

	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
)

func TestBeaconsPostgresPersistence(t *testing.T) {
	var persistence *persist.BeaconsPostgresPersistence
	var fixture BeaconsPersistenceFixture

	postgresUri := os.Getenv("POSTGRES_URI")
	postgresHost := os.Getenv("POSTGRES_HOST")
	if postgresHost == "" {
		postgresHost = "localhost"
	}

	postgresPort := os.Getenv("POSTGRES_PORT")
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
		panic("Connection params not set")
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

	opnErr := persistence.Open("")
	if opnErr != nil {
		t.Error("Error opened persistence", opnErr)
		return
	}
	defer persistence.Close("")

	opnErr = persistence.Clear("")
	if opnErr != nil {
		t.Error("Error cleaned persistence", opnErr)
		return
	}

	t.Run("BeaconsPostgresPersistence:CRUD Operations", fixture.TestCrudOperations)

	opnErr = persistence.Clear("")
	if opnErr != nil {
		t.Error("Error cleaned persistence", opnErr)
		return
	}

	t.Run("BeaconsPostgresPersistence:Get with Filters", fixture.TestGetWithFilters)

}
