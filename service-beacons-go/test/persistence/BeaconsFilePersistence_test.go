package test_persistence

import (
	"testing"

	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
)

type BeaconsFilePersistenceTest struct {
	persistence *persist.BeaconsFilePersistence
	fixture     *BeaconsPersistenceFixture
}

func NewBeaconsFilePersistenceTest() *BeaconsFilePersistenceTest {
	var persistence *persist.BeaconsFilePersistence
	var fixture *BeaconsPersistenceFixture

	persistence = persist.NewBeaconsFilePersistence("../../temp/beacons.test.json")
	persistence.Configure(cconf.NewEmptyConfigParams())
	fixture = NewBeaconsPersistenceFixture(persistence)

	return &BeaconsFilePersistenceTest{
		persistence: persistence,
		fixture:     fixture,
	}
}

func (c *BeaconsFilePersistenceTest) Setup(t *testing.T) {
	err := c.persistence.Open("")
	if err != nil {
		t.Error("Failed to open persistence", err)
	}

	err = c.persistence.Clear("")
	if err != nil {
		t.Error("Failed to clear persistence", err)
	}
}

func (c *BeaconsFilePersistenceTest) Teardown(t *testing.T) {
	err := c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func TestBeaconsFilePersistence(t *testing.T) {
	c := NewBeaconsFilePersistenceTest()
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
