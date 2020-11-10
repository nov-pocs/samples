package test_persistence

import (
	"testing"

	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
)

func TestBeaconsFilePersistence(t *testing.T) {
	var persistence *persist.BeaconsFilePersistence
	var fixture *BeaconsPersistenceFixture

	persistence = persist.NewBeaconsFilePersistence("../../temp/beacons.test.json")
	persistence.Configure(cconf.NewEmptyConfigParams())
	fixture = NewBeaconsPersistenceFixture(persistence)

	opnErr := persistence.Open("")
	if opnErr == nil {
		persistence.Clear("")
	}

	defer persistence.Close("")

	t.Run("BeaconsFilePersistence:CRUD Operations", fixture.TestCrudOperations)

	persistence.Clear("")
	t.Run("BeaconsFilePersistence:Get with Filters", fixture.TestGetWithFilters)
}
